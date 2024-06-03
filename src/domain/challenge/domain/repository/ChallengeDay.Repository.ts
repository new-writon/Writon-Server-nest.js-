import { Repository } from "typeorm";
import { Challenge } from "../entity/Challenge";
import { ChallengeDay } from "../entity/ChallengeDay";


export interface ChallengeDayRepository extends Repository<ChallengeDay>{

    findChallengeDayByChallengeIdAndDate(challengeId:number, date:Date):Promise<ChallengeDay>;

    findChallengeOverlapCount(challengeId: number): Promise<number>;

    findChallengeDayByChallengeId(challengeId: number): Promise<ChallengeDay[]>;

}