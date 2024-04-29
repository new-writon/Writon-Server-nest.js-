import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './global/config/configuration.js';
import { dataSource } from './global/config/database.js';
import { UserModule } from './domain/user/user.module.js';
import { AuthModule } from './domain/auth/auth.module.js';
import { AgoraModule } from './domain/agora/agora.module.js';
import { ErrorModule } from './domain/errorr/error.module.js';
import { SatisfactionModule } from './domain/satisfaction/satisfaction.module.js';
import { ChallengeModule } from './domain/challenge/challenge.module.js';
import { TemplateModule } from './domain/template/template.module.js';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './global/config/RedisConfig.js';
import { TokenManager } from './global/util/TokenManager.js';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configuration],
    }),
    TerminusModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dataSource)],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.getOrThrow('data-source');
      },     
    }),
    CacheModule.registerAsync({ isGlobal: true, useClass: RedisConfig }),
  
    UserModule,
    AuthModule,
    AgoraModule,
    ErrorModule,
    SatisfactionModule,
    ChallengeModule,
    TemplateModule,
  
    

  ],
  controllers: [],
 
})
export class AppModule { }
