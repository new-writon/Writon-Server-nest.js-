import { Injectable } from '@nestjs/common';
import { LoginResponse } from '../dto/response/loginResponse';
import { SocialLogin } from '../util/SocialLogin';
import { User } from '../../user/domain/entity/User';
import { AxiosResponse } from 'axios';
import { JwtManager } from '../util/JwtManager';
import { UserChallenge } from '../../user/domain/entity/UserChallenge';
import { checkData } from '../util/checker';
import { Affiliation } from '../../user/domain/entity/Affiliation';
import { UserApi } from '../intrastructure/User.Api';
import { AuthVerifyService } from '../../../global/exception/auth/AuthVerify.Service';
import { LoginTokenManager } from '../util/LoginTokenManager';
import { LocalLogin } from '../dto/request/LocalLogin';
import { Transactional } from '../../../global/decorator/transaction';
import { DataSource } from 'typeorm';
import { getKoreanYYYYMM } from 'src/global/util/date';
import { ChallengeStatusEnum } from 'src/global/enum/ChallengeStatus';
import { ChallengeApi } from '../intrastructure/Challenge.Api';

@Injectable()
export class AuthService {
  constructor(
    private readonly socialLogin: SocialLogin,
    private readonly jwtManager: JwtManager,
    private readonly loginTokenManager: LoginTokenManager,
    private readonly userApi: UserApi,
    private readonly authVerifyService: AuthVerifyService,
    private readonly dataSource: DataSource,
    private readonly challengeApi: ChallengeApi,
  ) {}

  public async kakaoLogin(
    organization: string,
    challengeId: number,
    kakaoToken: string,
  ): Promise<LoginResponse> {
    const kakaoData = await this.socialLogin.getKakaoData(kakaoToken);
    const userData: User = await this.userApi.requestUserDataBySocialNumberOrIdentifier(
      kakaoData.data.id,
    );
    await this.signInDependingOnRegistrationStatus(userData, kakaoData);
    const checkedUserData: User = await this.userApi.requestUserDataBySocialNumberOrIdentifier(
      kakaoData.data.id,
    );
    const accessToken = this.jwtManager.makeAccessToken(
      checkedUserData.getId(),
      checkedUserData.getRole(),
    ); // 해당 데이터 자체를 User엔티티에 넣어주기 유저 엔티티 함수에서 get함수를 통해 토큰 구현
    const refreshToken = this.jwtManager.makeRefreshToken();
    await this.loginTokenManager.setToken(
      String(checkedUserData.getId()),
      [refreshToken],
      30 * 24 * 60 * 60,
    );
    // 디비 토큰 추가 함수
    const authToken = await this.userApi.requestAuthTokenByUserIdAndToken(
      checkedUserData.getId(),
      refreshToken,
    );
    const checkFlag = checkData(authToken);
    await this.addAuthToken(checkFlag, checkedUserData.getId(), refreshToken);
    // eslint-disable-next-line prefer-const
    let [
      { affiliatedConfirmation, checkAffiliation },
      challengedConfirmation,
      {
        affiliatedConfirmation: writonAffiliatedConfirmation,
        checkAffiliation: checkWritonAffiliation,
      },
      challenge,
    ] = await Promise.all([
      this.checkAffiliationStatus(organization, checkedUserData.getId()),
      this.checkOngoingChallenge(organization, checkedUserData.getId(), challengeId),
      this.checkAffiliationStatus('라이톤', checkedUserData.getId()),
      this.challengeApi.requestChallengeByStatus(ChallengeStatusEnum.WRITON, getKoreanYYYYMM()),
    ]);

    affiliatedConfirmation = this.checkOrganization(organization, affiliatedConfirmation);
    await this.checkWritonChallenge(writonAffiliatedConfirmation, checkWritonAffiliation);
    // 조건 달성 시 로직 실행
    return LoginResponse.of(
      accessToken,
      refreshToken,
      checkedUserData.getRole(),
      affiliatedConfirmation,
      challengedConfirmation,
      writonAffiliatedConfirmation,
      '라이톤',
      challenge.getId(),
    );
  }

  async checkWritonChallenge(
    writonAffiliatedConfirmation: boolean,
    affiliation: Affiliation,
  ): Promise<void> {
    if (writonAffiliatedConfirmation) {
      await this.userApi.executeInsertWritonerChallenge(affiliation);
    }
  }

  public async localLogin(loginLocal: LocalLogin): Promise<LoginResponse> {
    const userData: User = await this.userApi.requestUserDataBySocialNumberOrIdentifier(
      loginLocal.getIdentifier(),
    );
    console.log(userData);
    this.authVerifyService.vefifyIdentifier(userData);
    await this.authVerifyService.verifyPassword(loginLocal.getPassword(), userData.getPassword());
    const accessToken = this.jwtManager.makeAccessToken(userData.getId(), userData.getRole());
    const refreshToken = this.jwtManager.makeRefreshToken();
    await this.loginTokenManager.setToken(
      String(userData.getId()),
      [refreshToken],
      30 * 24 * 60 * 60,
    );

    // 디비 토큰 추가 함수
    const authToken = await this.userApi.requestAuthTokenByUserIdAndToken(
      userData.getId(),
      refreshToken,
    );
    const checkFlag = checkData(authToken);
    await this.addAuthToken(checkFlag, userData.getId(), refreshToken);
    // eslint-disable-next-line prefer-const
    let [
      { affiliatedConfirmation, checkAffiliation },
      challengedConfirmation,
      {
        affiliatedConfirmation: writonAffiliatedConfirmation,
        checkAffiliation: checkWritonAffiliation,
      },
      challenge,
    ] = await Promise.all([
      this.checkAffiliationStatus(loginLocal.getOrganization(), userData.getId()),
      this.checkOngoingChallenge(
        loginLocal.getOrganization(),
        userData.getId(),
        loginLocal.getChallengeId(),
      ),
      this.checkAffiliationStatus('라이톤', userData.getId()),
      this.challengeApi.requestChallengeByStatus(ChallengeStatusEnum.WRITON, getKoreanYYYYMM()),
    ]);
    affiliatedConfirmation = this.checkOrganization(
      loginLocal.getOrganization(),
      affiliatedConfirmation,
    );
    await this.checkWritonChallenge(writonAffiliatedConfirmation, checkWritonAffiliation);
    return LoginResponse.of(
      accessToken,
      refreshToken,
      userData.getRole(),
      affiliatedConfirmation,
      challengedConfirmation,
      writonAffiliatedConfirmation,
      '라이톤',
      challenge.getId(),
    );
  }

  private async addAuthToken(flag: boolean, userId: number, token: string) {
    if (flag) {
      await this.userApi.executeInsertAuthToken(userId, token);
    }
  }

  @Transactional()
  public async logout(userId: string, refreshToken: string, engineValue: string): Promise<void> {
    await this.loginTokenManager.deleteToken(userId, refreshToken);
    await this.userApi.executeDeleteFirebaseToken(Number(userId), engineValue);
    // 디비 토큰 삭제
    await this.userApi.executeDeleteAuthToken(Number(userId), refreshToken);
  }

  private checkOrganization(organization: string, affiliatedConfirmation: boolean): null | boolean {
    if (organization === 'null') {
      return (affiliatedConfirmation = null);
    }
    return affiliatedConfirmation;
  }

  private async signInDependingOnRegistrationStatus(
    userData: User,
    kakaoData: AxiosResponse<any, any>,
  ) {
    if (!checkData(userData)) {
      this.userApi.executeKakaoSignUp(
        kakaoData.data.kakao_account.email,
        kakaoData.data.id,
        kakaoData.data.properties.profile_image,
      );
    }
  }

  public async checkAffiliationStatus(
    organization: string,
    userId: number,
  ): Promise<{
    affiliatedConfirmation: boolean;
    checkAffiliation: Affiliation;
  }> {
    const checkAffiliation: Affiliation =
      await this.userApi.requestAffiliationByUserIdAndOrganization(userId, organization);
    const affiliatedConfirmation: boolean = checkData(checkAffiliation);
    return { affiliatedConfirmation, checkAffiliation };
  }

  private async checkOngoingChallenge(
    organization: string,
    userId: number,
    challengeId: number,
  ): Promise<boolean | null> {
    const checkChallenge: UserChallenge[] =
      await this.userApi.requestUserChallengeByUserIdAndOrganizationAndChallengeId(
        userId,
        organization,
        challengeId,
      );
    const challengedConfirmation: boolean = checkData(checkChallenge[0]);
    return challengedConfirmation;
  }
}
