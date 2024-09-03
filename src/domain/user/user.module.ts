import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/User';
import { Affiliation } from './domain/entity/Affiliation';
import { Organization } from './domain/entity/Organization';
import { UserChallenge } from './domain/entity/UserChallenge';
import { UserDao } from './domain/repository/dao/User.Dao';
import { TokenManager } from '../../global/util/TokenManager';
import { MailManager } from '../../global/util/MailManager';
import { AuthService } from '../auth/service/Auth.Service';
import { UserChallengeController } from './presentation/UserChallenge.Controller';
import { UserChallengeService } from './service/UserChallenge.Service';
import { AffiliationDao } from './domain/repository/dao/Affiliation.Dao';
import { UserChallengeDao } from './domain/repository/dao/UserChallenge.Dao';
import { AuthModule } from '../auth/auth.module';
import { TemplateModule } from '../template/template.module';
import { ChallengeModule } from '../challenge/challenge.module';
import { UserChallengeHelper } from './helper/UserChallenge.Helper';
import { AffiliationHelper } from './helper/Affiliation.Helper';
import { UserHelper } from './helper/User.Helper';
import { ChallengeApi } from './infrastruture/Challenge.Api';
import { TemplateApi } from './infrastruture/Template.Api';
import { UserApi } from '../auth/intrastructure/User.Api';
import { OrganizationDao } from './domain/repository/dao/Organization.Dao';
import { AffiliationService } from './service/Affiliation.Service';
import { AffiliationController } from './presentation/Affiliation.Controller';
import { OrganizationHelper } from './helper/Organization.Helper';
import { DataMapperService } from './domain/service/DataMapper.Service';
import { UserVerifyService } from './domain/service/UserVerify.Service';
import { CheeringPhraseController } from './presentation/CheeringPhrase.Controller';
import { CheeringPhraseService } from './service/CheeringPhrase.Service';
import { UserController } from './presentation/User.controller';
import { UserService } from './service/User.service';
import { OrganizationService } from './service/Organization.Service';
import { OrgnizationController } from './presentation/Organization.Controller';
import { LoginTokenManager } from '../auth/util/LoginTokenManager';
import { CacheImpl } from 'src/global/util/CacheImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Affiliation, Organization, UserChallenge]),
    AuthModule,
    TemplateModule,
    ChallengeModule
  ],
  providers: [
    UserService, 
    {provide: 'userImpl', useClass: UserDao}, 
    {provide: 'affiliationImpl', useClass: AffiliationDao},
    {provide: 'userchallengeImpl', useClass: UserChallengeDao},
    {provide: 'organizationImpl', useClass: OrganizationDao},
    LoginTokenManager, 
    MailManager,
    AuthService, 
    UserChallengeService, 
    AffiliationService,
    OrganizationService,
    UserChallengeHelper,
    AffiliationHelper,
    OrganizationHelper,
    UserHelper,
    ChallengeApi,
    TemplateApi,
    UserApi,
    DataMapperService,
    UserVerifyService,
    CheeringPhraseService,
    CacheImpl 
  ],

  controllers:[UserController, UserChallengeController, AffiliationController,CheeringPhraseController, OrgnizationController],
  exports:[UserChallengeHelper, AffiliationHelper, UserHelper, OrganizationHelper]
})
export class UserModule {}
