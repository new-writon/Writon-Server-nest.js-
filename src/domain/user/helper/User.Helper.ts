import { Inject } from "@nestjs/common";
import { UserRepository } from "../domain/repository/User.Repository";
import { UserAffiliationOrganization } from "../dto/values/UserAffilatiionOrganization.interface";
import { User } from "../domain/entity/User";
import { UserVerifyService } from "../../../global/exception/user/UserVerify.Service";
import { FirebaseTokenRepository } from "../domain/repository/FirebaseToken.Repository";
import { FirebaseToken } from "../domain/entity/FirebaseToken";


export class UserHelper {
    constructor(
        @Inject('userImpl')
        private readonly userRepository: UserRepository,
        @Inject('firebasetokenImpl')
        private readonly firebaseTokenRepository: FirebaseTokenRepository,
        private readonly userVerifyService: UserVerifyService
    ){}


    public async giveUserDataBySocialNumberOrIdentifier(idenfitier: string){
        return this.userRepository.selectUserDataBySocialNumberOrIdentifier(idenfitier);
    }

    public async executeLocalSignUp(identifier: string, password: string, email: string){
        return this.userRepository.localSignUp(identifier, password, email);
    }

    public async giveUserByEmail(email: string){
        return this.userRepository.findUserByEmail(email);
    }

    public async executeUpdatePassword(idenfitier: string, email:string, password:string){
        return  this.userRepository.updatePassword(idenfitier, email, password);
    }

    public async giveUserById(userId: number){
        return this.userRepository.selectUserById(userId);
    }

    public async executeUpdatePasswordByUserId(userId: number, password: string){
        return this.userRepository.updatePasswordByUserId(userId, password);
    }

    public async executeKakaoSignUp(email: string, kakaoId: string, profileImage: string){
        return this.userRepository.kakaoSignUp(email, kakaoId, profileImage);
    }

    public async giveUserAffiliation(userId: number, organization: string): Promise<UserAffiliationOrganization[]>{
        return this.userRepository.findUserAffiliation(userId, organization);
    }

    public async executeUpdateAccount(accountNumber:string, bank:string, userId:number):Promise<void>{
        return this.userRepository.updateAccount(accountNumber, bank, userId);
    }

    public async giveFirebaseTokenByUserIdAndEngineValue(userId:number, engineValue:string){
        return this.firebaseTokenRepository.findFirebaseTokenByUserIdAndEngineValue(userId, engineValue);

    }

    public async executeInsertFirebaseToken(userId:number, engineValue:string){
        await this.firebaseTokenRepository.insertFirebaseToken(userId, engineValue);
    }

    public async executeDeleteFirebaseToken(userId:number, engineValue:string){
        await this.firebaseTokenRepository.deleteFirebaseToken(userId, engineValue);
    }

    public async giveFirebaseTokenWithUserChallengeId(userChallengeId:number):Promise<FirebaseToken[]>{
         return this.firebaseTokenRepository.findFirebaseTokenWithUserChallengeId(userChallengeId)
    }


}