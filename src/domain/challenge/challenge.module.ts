import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './domain/entity/Challenge.js';
import { ChallengeDay } from './domain/entity/ChallengeDay.js';
import { ChallengeDepositDeduction } from './domain/entity/ChallengeDepositDeduction.js';
import { Question } from './domain/entity/Question.js';
import { QuestionTag } from './domain/entity/QuestionTag.js';
import { ChallengeInformationController } from './presentation/ChallengeInformationController.js';
import { ChallengeInformationService } from './service/ChallengeInformation.Service.js';
import { ChallengeDao } from './domain/repository/dao/Challenge.Dao.js';
import { ChallengeDayDao } from './domain/repository/dao/ChallengeDay.Dao.js';



@Module({
  imports: [

    TypeOrmModule.forFeature([Challenge, ChallengeDay, ChallengeDepositDeduction, Question, QuestionTag]),

  
  ],
  providers: [
    ChallengeInformationService, {
      provide: 'impl',  useClass: ChallengeDao, // provide에 문자열 토큰 지정
    }, {
      provide: 'impl',  useClass: ChallengeDayDao, // provide에 문자열 토큰 지정
    }
  
  ],
  controllers: [ChallengeInformationController],
})
export class ChallengeModule {}
