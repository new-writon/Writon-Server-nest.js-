import { Inject, Injectable } from "@nestjs/common";
import { AffiliationRepository } from "../domain/repository/Affiliation.Repository";
import { Affiliation } from "../domain/entity/Affiliation";
import { ChallengesPerOrganization } from "../dto/values/ChallengesPerOrganization";
import { UserProfile } from "../dto/response/UserProfile";
import { UserVerifyService } from "../domain/service/UserVerify.Service";
import { Participant } from "../dto/response/Participant";
import { AffiliationStart } from "../dto/request/AffiliationStart";
import { ProfileUpdate } from "../dto/request/ProfileUpdate";

@Injectable()
export class AffiliationHelper {

    constructor(
        @Inject('affiliationImpl')
        private readonly affiliationRepository: AffiliationRepository,
        private readonly userVerifyService: UserVerifyService
    ){}

    public async giveAffiliationByUserIdWithOrganization(userId: number, organization: string, verifyFlag:boolean): Promise<Affiliation>{
        const data = await this.affiliationRepository.findAffiliationByUserIdWithOrganization(userId, organization);
        if(verifyFlag) this.userVerifyService.verifyAffiliation(data);
        return data;
    }

    public async giveAffiliationByNicknameAndOrganization(nickname:string, organization: string, verifyFlag:boolean): Promise<Affiliation>{
        const data = await this.affiliationRepository.findAffiliationByNicknameAndOrganization(nickname, organization);
        if(verifyFlag) this.userVerifyService.verifyAffiliation(data);
        return data;
    }

    public async insertAffiliation(userId:number, organizationId:number, affiliationStartDto: AffiliationStart):Promise<void>{
            return this.affiliationRepository.insertAffiliation(userId, organizationId, affiliationStartDto);
    }

    public async giveChallengesPerOrganizationByUserId(userId:number):Promise<ChallengesPerOrganization[]>{
        return this.affiliationRepository.findChallengesPerOrganizationByUserId(userId);
    }


    public async giveUserProfileByUserIdAndOrganization(userId:number, organization:string):Promise<UserProfile>{
        return this.affiliationRepository.findUserProfileByUserIdAndOrganization(userId, organization);
    }

    public async executeUpdateUserProfileByUserIdAndOrganization(userId:number,organization:string,profileUpdate: ProfileUpdate):Promise<void>{
            await this.affiliationRepository.updateUserProfileByUserIdAndOrganization(userId,organization,profileUpdate);
        }

    public async giveAffilaitonWithChallengeIdArray(userChallengeId:number[], verifyFlag:boolean):Promise<Affiliation[]>{
        const datas = await this.affiliationRepository.findAffilaitonWithChallengeIdArray(userChallengeId);
        if(verifyFlag) this.userVerifyService.verifyAffiliations(datas);
        return datas;
    }

    public async giveAffilaitonWithChallengeIdAndUserChallengeId(challengeId:number, userChallengeId:number[], verifyFlag:boolean):Promise<Affiliation[]>{
        const datas = await this.affiliationRepository.findAffilaitonWithChallengeIdAndUserChallengeId(challengeId, userChallengeId);
        if(verifyFlag) this.userVerifyService.verifyAffiliations(datas);
        return datas;
    }

    public async giveAffiliationById(affiliationId: number[], verifyFlag:boolean):Promise<Affiliation[]>{
        const datas = await this.affiliationRepository.findAffiliationById(affiliationId);
        if(verifyFlag) this.userVerifyService.verifyAffiliations(datas);
        return datas;
    }

    
    public async giveAffiliationAndUserById(affiliationId: number[]):Promise<Affiliation[]>{
        return this.affiliationRepository.findAffiliationAndUserById(affiliationId);
    }

    public async giveAffiliationAndUserAndUserChallengeWithUserIdAndChallengeId(userId:number, challengeId:number):Promise<Participant>{
        return this.affiliationRepository.findAffiliationAndUserAndUserChallengeWithUserIdAndChallengeId(userId, challengeId);
    }

    public async giveAffiliationAndUserAndUserChallengeWithExceptUserIdAndChallengeId(userId:number, challengeId:number):Promise<Participant[]>{
        return this.affiliationRepository.findAffiliationAndUserAndUserChallengeWithExceptUserIdAndChallengeId(userId, challengeId);
    }

    public async giveAffiliationAndUserByUserIdWithOrganization(userId: number, organization: string, verifyFlag:boolean):Promise<Affiliation>{
        const data = await this.affiliationRepository.findAffiliationAndUserByUserIdWithOrganization(userId, organization);
        if(verifyFlag) this.userVerifyService.verifyAffiliation(data);
        return data;
    }
    
}