import { Injectable } from "@nestjs/common";
import { Affiliation } from "../../../domain/user/domain/entity/Affiliation";
import { AffiliationHelper } from "../../../domain/user/helper/Affiliation.Helper";
import { UserChallengeHelper } from "../../user/helper/UserChallenge.Helper";
import { UserChallenge } from "../../user/domain/entity/UserChallenge";


@Injectable()
export class UserApi {

    constructor(
        private readonly affiliationHelper: AffiliationHelper,
        private readonly userChallengeHelper: UserChallengeHelper
    ){}

    public async requestAffiliationByUserIdAndOrganization(userId: number, organization: string): Promise<Affiliation>{
        return this.affiliationHelper.giveAffiliationByUserIdAndOrganization(userId, organization);
    }

    public async requestAffiliationByNicknameAndOrganization(nickname:string, organization: string): Promise<Affiliation>{
        return this.affiliationHelper.giveAffiliationByNicknameAndOrganization(nickname, organization);
    }

    public async requestUserChallengeByUserIdAndOrganizationAndChallengeId(userId: number, organization: string, challengeId: number): Promise<UserChallenge[]>{
        return this.userChallengeHelper.giveUserChallengeByUserIdAndOrganizationAndChallengeId(userId, organization, challengeId)
    }

    public async requestUserChallengeByUserTemplateIdArrayAndChallengeId(userChallengeId:number[], challengeId:number):Promise<UserChallenge[]>{
        return this.userChallengeHelper.giveUserChallengeByUserTemplateIdArrayAndChallengeId(userChallengeId, challengeId);
    }

    public async requestAffilaitonWithChallengeIdArray(userChallengeId:number[]):Promise<Affiliation[]>{
        return this.affiliationHelper.giveAffilaitonWithChallengeIdArray(userChallengeId)
    }

    public async requestAffilaitonWithChallengeIdAndUserChallengeId(challengeId:number, userChallengeId:number[]):Promise<Affiliation[]>{
        return this.affiliationHelper.giveAffilaitonWithChallengeIdAndUserChallengeId(challengeId, userChallengeId);
    }

    public async requestUserChallengeAndAffiliationByChallengeIdWithUserIdAndOrganization(challengeId:number, userId:number, organization:string):Promise<UserChallenge>{
        return this.userChallengeHelper.giveUserChallengeAndAffiliationByChallengeIdWithUserIdAndOrganization(challengeId, userId, organization);
    }

    public async requestAffiliationById(affiliationId: number[]):Promise<Affiliation[]>{
        return this.affiliationHelper.giveAffiliationById(affiliationId)
    }

    public async requestUserChallengeAndAffiliationAndUserByChallengeId(challengeId:number):Promise<UserChallenge[]>{
        return this.userChallengeHelper.giveUserChallengeAndAffiliationAndUserByChallengeId(challengeId);
    }

    public async requestAffiliationAndUserByUserIdAndOrganization(userId: number, organization: string):Promise<Affiliation>{
        return this.affiliationHelper.giveAffiliationAndUserByUserIdAndOrganization(userId, organization);
    }

    public async requestAffiliationAndUserById(affiliationId: number[]):Promise<Affiliation[]>{
        return this.affiliationHelper.giveAffiliationAndUserById(affiliationId);
    }

    public async requestUserChallengeAndAffiliationAndUserById(userChallengeId:number):Promise<UserChallenge>{
        return this.userChallengeHelper.giveUserChallengeAndAffiliationAndUserById(userChallengeId);
    }


}