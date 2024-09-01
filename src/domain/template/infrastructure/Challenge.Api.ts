import { Injectable } from "@nestjs/common";
import { ChallengeDayHelper } from "../../challenge/helper/ChallengeDay.Helper";
import { ChallengeDay } from "../../challenge/domain/entity/ChallengeDay";
import { Question } from "../../challenge/domain/entity/Question";
import { QuestionHelper } from "../../challenge/helper/Question.Helper";


@Injectable()
export class ChallengeApi{


    constructor(
        private readonly challengeDayHelper: ChallengeDayHelper,
        private readonly questionHelper: QuestionHelper
    ){}

    public async requestChallengeDayByChallengeIdAndDate(challengeId:number, date:string, verifyFlag:boolean):Promise<ChallengeDay>{
        return this.challengeDayHelper.giveChallengeDayByChallengeIdAndDate(challengeId,date,verifyFlag);
    }

    public async requestQuestionById(questionId:number[], verifyFlag:boolean):Promise<Question[]>{
        return this.questionHelper.giveQuestionById(questionId, verifyFlag)  
    }

   

}