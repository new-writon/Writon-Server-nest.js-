import { Injectable } from "@nestjs/common";
import { Challenge } from "../../challenge/domain/entity/Challenge.js";
import { ChallengeHelper } from "../../challenge/helper/Challenge.Helper.js";
import { ChallengeDayHelper } from "../../challenge/helper/ChallengeDay.Helper.js";


@Injectable()
export class ChallengeApi{

    constructor(
        private readonly challengeHelper: ChallengeHelper,
        private readonly challengeDayHelper: ChallengeDayHelper,
    ){}

    public async requestChallengeById(challengeId: number): Promise<Challenge>{
        return this.challengeHelper.giveChallengeById(challengeId);
    }


    public async requestChallengeOverlapCount(challengeId: number): Promise<number>{
        return this.challengeDayHelper.giveChallengeOverlapCount(challengeId);
    }

}