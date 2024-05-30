import { Inject, Injectable } from "@nestjs/common";
import { UserChallenge } from "../domain/entity/UserChallenge.js";
import { UserChallengeRepository } from "../domain/repository/UserChallenge.Repository.js";
import { DataMapperService } from "../domain/service/DataMapper.Service.js";

@Injectable()
export class UserChallengeHelper{

    constructor(
        @Inject('userchallengeImpl')
        private readonly userChallengeRepository: UserChallengeRepository,
        private readonly dataMapperService:DataMapperService

    ){}

    public async giveUserChallengeByUserIdAndOrganizationAndChallengeId(userId:number, organization:string, challengeId: number){
        return this.userChallengeRepository.findUserChallengeByUserIdAndOrganizationAndChallengeId(userId, organization, challengeId);
    }

    public async giveUserChallengeByAffiliationIdAndId(affiliationId: number, challengeId: number):Promise<UserChallenge>{
        return this.userChallengeRepository.findUserChallengeByAffiliationIdAndId(affiliationId,challengeId);
    }

    public async executeInsertUserChallenge(affiliationId:number, challengeId: number, deposit:number, review: number): Promise<void>{
        return this.userChallengeRepository.insertUserChallenge(affiliationId,challengeId, deposit, review);
    }

    public async giveUserChallengeWithUserIdAndOragnizationByChallengeId(userId:number, organization:string, challengeId:number):Promise<UserChallenge>{
        return this.userChallengeRepository.findUserChallengeWithUserIdAndOragnizationByChallengeId(userId, organization, challengeId);
    }

    public async giveUserChallengeByUserTemplateIdArrayAndChallengeId(userChallengeId:number[], challengeId:number):Promise<UserChallenge[]>{
        return this.userChallengeRepository.findUserChallengeByUserTemplateIdArrayAndChallengeId(userChallengeId, challengeId);
    }

    public async executeUpdateUserChallengeCheckCount(userChallengeId:number, checkCount:number):Promise<void>{
        await this.userChallengeRepository.updateUserChallengeCheckCount(userChallengeId, checkCount);
    }


}