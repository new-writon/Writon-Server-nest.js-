import {  Injectable } from "@nestjs/common";
import { LoginResponse } from "../dto/response/loginResponse.js";
import { SocialLogin } from "../util/SocialLogin.js";
import { User } from "../../user/domain/entity/User.js";
import { AxiosResponse } from "axios";
import { JwtManager } from "../util/JwtManager.js";
import { TokenManager } from "../../../global/util/TokenManager.js";
import { UserChallenge } from "../../user/domain/entity/UserChallenge.js";
import { checkData } from "../util/checker.js";
import { UserHelper } from "../../user/helper/User.Helper.js";
import { AffiliationHelper } from "../../user/helper/Affiliation.Helper.js";
import { Affiliation } from "../../user/domain/entity/Affiliation.js";
import { UserChallengeHelper } from "../../user/helper/UserChallenge.Helper.js";
import { verifyPassword, vefifyIdentifier } from "../util/checker.js";

@Injectable()
export class AuthService {

    constructor(
        private readonly socialLogin: SocialLogin,
        private readonly jwtManager: JwtManager,
        private readonly tokenManager: TokenManager,
        private readonly userHelper: UserHelper,
        private readonly affiliationHelper: AffiliationHelper,
        private readonly userChallengeHelper: UserChallengeHelper
    ) { }


    public async kakaoLogin(organization: string, challengeId: number, kakaoToken: string): Promise<LoginResponse> {

        const kakaoData = await this.socialLogin.getKakaoData(kakaoToken);
        const userData: User = await this.userHelper.giveUserDataBySocialNumberOrIdentifier(kakaoData.data.id);
        await this.signInDependingOnRegistrationStatus(userData, kakaoData);
        const checkedUserData: User = await this.userHelper.giveUserDataBySocialNumberOrIdentifier(kakaoData.data.id);
        const accessToken = this.jwtManager.makeAccessToken(checkedUserData.getUserId(), checkedUserData.getRole()); // 해당 데이터 자체를 User엔티티에 넣어주기 유저 엔티티 함수에서 get함수를 통해 토큰 구현
        const refreshToken = this.jwtManager.makeRefreshToken();
        await this.tokenManager.setToken(String(checkedUserData.getUserId()), refreshToken);
        let [affiliatedConfirmation, challengedConfirmation] = await Promise.all([
            this.checkAffiliationStatus(organization, checkedUserData.getUserId()),
            this.checkOngoingChallenge(organization, checkedUserData.getUserId(), challengeId)
        ]);
        affiliatedConfirmation = this.checkOrganization(organization, affiliatedConfirmation);
        return LoginResponse.of(accessToken, refreshToken, checkedUserData.getRole(), affiliatedConfirmation, challengedConfirmation);
    }

    public async localLogin(identifier: string, password: string, organization: string, challengeId: number): Promise<LoginResponse> {

        const userData: User = await this.userHelper.giveUserDataBySocialNumberOrIdentifier(identifier);
        vefifyIdentifier(userData);
        await verifyPassword(password, userData.getPassword())
        const accessToken = this.jwtManager.makeAccessToken(userData.getUserId(), userData.getRole());
        const refreshToken = this.jwtManager.makeRefreshToken();
        await this.tokenManager.setToken(String(userData.getUserId()), refreshToken);
        let [affiliatedConfirmation, challengedConfirmation] = await Promise.all([
            this.checkAffiliationStatus(organization, userData.getUserId()),
            this.checkOngoingChallenge(organization, userData.getUserId(), challengeId)
        ]);
        affiliatedConfirmation = this.checkOrganization(organization, affiliatedConfirmation);
        return LoginResponse.of(accessToken, refreshToken, userData.getRole(), affiliatedConfirmation, challengedConfirmation);
    }




    public async logout(userId: string): Promise<void> {
        await this.tokenManager.deleteToken(userId)
    }













 












    private checkOrganization(organization: string, affiliatedConfirmation: boolean): null | boolean {
        if (organization === "null") {
            return affiliatedConfirmation = null
        }
        return affiliatedConfirmation;
    }

    private async signInDependingOnRegistrationStatus(userData: User, kakaoData: AxiosResponse<any, any>) {
        if (!checkData(userData)) {
            this.userHelper.executeKakaoSignUp(kakaoData.data.kakao_account.email, kakaoData.data.id, kakaoData.data.properties.profile_image);
        }
    }

    public async checkAffiliationStatus(
        organization: string,
        userId: number
    ): Promise<boolean | null> {

        const checkAffiliation: Affiliation = await this.affiliationHelper.giveAffiliationByUserIdAndOrganization(userId, organization);
        const affiliatedConfirmation: boolean = checkData(checkAffiliation);
        return affiliatedConfirmation;
    }

    private async checkOngoingChallenge(
        organization: string,
        userId: number,
        challengeId: number
    ): Promise<boolean | null> {

        const checkChallenge: UserChallenge[] = await this.userChallengeHelper.giveUserChallengeByUserIdAndOrganizationAndChallengeId(userId, organization, challengeId);
        const challengedConfirmation: boolean = checkData(checkChallenge[0]);
        return challengedConfirmation;
    }




}