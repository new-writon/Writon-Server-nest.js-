import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserController } from './presentation/User.Controller.js';
import { User } from './domain/entity/User.js';
import { UserService  } from './domain/service/User.Service.js';
import { Affiliation } from './domain/entity/Affiliation.js';
import { Organization } from './domain/entity/Organization.js';
import { UserChallenge } from './domain/entity/UserChallenge.js';
import { UserDao } from './domain/repository/User.Dao.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Affiliation, Organization, UserChallenge]),

  
  ],
  providers: [
    UserService, UserDao
  ],
  controllers: [UserController],
})
export class UserModule {}
