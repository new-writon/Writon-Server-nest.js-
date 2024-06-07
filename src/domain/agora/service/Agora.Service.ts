import { Injectable } from "@nestjs/common";
import { AgoraHelper } from "../helper/Agora.Helper.js";
import { Agora } from "../domain/entity/Agora.js";
import { UserApi } from "../infrastructure/User.Api.js";
import { ParticularAgoraData } from "../dto/ParticularAgoraData.js";
import { UserChallenge } from "src/domain/user/domain/entity/UserChallenge.js";
import { AgoraAddResult } from "../dto/response/AgoraAddResult.js";
import { AgoraDataResult } from "../dto/response/\bAgoraDataResult.js";


@Injectable()
export class AgoraService{

    constructor(
        private readonly agoraHelper: AgoraHelper,
        private readonly userApi: UserApi
    ){}


    public async checkAgoraAdd(challengeId:number, date:Date):Promise<AgoraAddResult>{
        const particularAgoraData = await this.agoraHelper.giveAgoraByChallengeIdAndDate(challengeId, date);
        const agoraLimitResult = this.checkAgoraLimit(particularAgoraData);
        return AgoraAddResult.of(agoraLimitResult);
    }




    public async bringAgora(userId:number, challengeId:number, date:Date){

        // 1. 특정 아고라 정보 조회
        const particularAgoraData = await this.agoraHelper.giveAgoraByChallengeIdAndDate(challengeId, date);
        // 2. 1번 데이터에서 userChallengeId를 추출
        const userChallengeId = this.sortUserChallengeId(particularAgoraData);
        // 3. 2번 데이터를 통해 userChallege 데이터를 가져옴.
        const userChallengeData = await this.userApi.requestUserChallengeAndAffiliationAndUserByUserChallengeIdAndChallengeId(userChallengeId, challengeId);
        const mergedAgoraData = this.mergeUserChallenge(particularAgoraData, userChallengeData, userId);
        return AgoraDataResult.of(mergedAgoraData);
    }



    private sortUserChallengeId(agora: ParticularAgoraData[]){
        return agora.map((agoraData) => agoraData.getUserChallengeId())
    }

    private mergeUserChallenge(particularAgoraData: ParticularAgoraData[], userChallenge: UserChallenge[], userId:number):AgoraDataResult[]{
        return userChallenge.flatMap((userChallenge) => {
            return particularAgoraData.filter((particularAgoraData) => userChallenge.getId() === particularAgoraData.getUserChallengeId())
            .map((particularAgoraData) => {
                const distinguishedUser = this.distinguishUser(userChallenge.affiliation.user.getId(), userId);
                return new AgoraDataResult(
                    particularAgoraData.getAgoraId(),
                    particularAgoraData.getQuestion(),
                    particularAgoraData.getParticipateCount(),
                    userChallenge.affiliation.getNickname(),
                    particularAgoraData.getCreatedTime(),
                    particularAgoraData.getCreatedDate(),
                    userChallenge.affiliation.user.getProfileImage(),
                    distinguishedUser,
                )
            })    
        });
    }

    private distinguishUser(relativeUserId:number, relativedUserId: number): string{
        if(relativeUserId === relativedUserId){
            return '1'
        }
        return '0'
    }

    private checkAgoraLimit(agora:ParticularAgoraData[]){
        if(agora.length >= 3){
            return false;
        }
        return true;
    }





}