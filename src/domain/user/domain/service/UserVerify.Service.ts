import { Injectable } from "@nestjs/common";
import { UserChallenge } from "../entity/UserChallenge";
import { UserException } from "../../exception/UserException";
import { UserErrorCode } from "../../exception/UserErrorCode";
import { checkData } from "../../util/checker";
import { Affiliation } from "../entity/Affiliation";
import { User } from "../entity/User";
import { Organization } from "../entity/Organization";

@Injectable()
export class UserVerifyService{

    public verifyUserChallenge(userChallenge:UserChallenge){
        if(!checkData(userChallenge))
            throw new UserException(UserErrorCode.NOT_FOUND_USERCHALLENGE);
    }

    public verifyUserChallenges(userChallenges:UserChallenge[]){
        if(!checkData(userChallenges))
            throw new UserException(UserErrorCode.NOT_FOUND_USERCHALLENGE);
    }

    public verifyAffiliation(affiliation:Affiliation){
        if(!checkData(affiliation))
            throw new UserException(UserErrorCode.NOT_FOUND_AFFILIATION);
    }

    public verifyAffiliations(affiliations:Affiliation[]){
        if(!checkData(affiliations))
            throw new UserException(UserErrorCode.NOT_FOUND_AFFILIATION);
    }

    public verifyOrganization(organization:Organization){
        if(!checkData(organization))
            throw new UserException(UserErrorCode.NOT_FOUND_ORGANIZATION);
    }

    /**
     * 
     * @param user 
     * @returns 유저 정보가 없을 시 에러를 터뜨린다.
     */
    public verifyUser(user:User){
        if(!checkData(user))     // 유저 정보가 없을 시 
            throw new UserException(UserErrorCode.NOT_FOUND_USER);  
    }


}