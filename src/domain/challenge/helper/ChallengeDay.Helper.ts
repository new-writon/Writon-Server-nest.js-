import { Inject, Injectable } from "@nestjs/common";
import { ChallengeDayRepository } from "../domain/repository/ChallengeDay.Repository.js";
import { ChallengeDay } from "../domain/entity/ChallengeDay.js";

@Injectable()
export class ChallengeDayHelper{


    constructor(
        @Inject('challengedayImpl')
        private readonly challengeDayRepository: ChallengeDayRepository,
    ){}

    public async giveOverlapCount(challengeId: number): Promise<number>{

        return this.challengeDayRepository.findOverlapCount(challengeId);
    }

    public async giveChallengeDayByChallengeId(challengeId: number): Promise<ChallengeDay[]>{
        return this.challengeDayRepository.findChallengeDayByChallengeId(challengeId);
    }

    public async giveChallengeDayByChallengeIdAndDate(challengeId:number, date:Date):Promise<ChallengeDay>{
        return this.challengeDayRepository.findChallengeDayByChallengeIdAndDate(challengeId, date);
    }



    

}