import { Repository } from "typeorm";
import { Challenge } from "../entity/Challenge";


export interface ChallengeRepository extends Repository<Challenge>{

    findChallengeById(challengeId: number): Promise<Challenge[]>;

    

}