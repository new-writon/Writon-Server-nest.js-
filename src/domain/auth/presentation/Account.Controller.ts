import { User } from "../../user/domain/entity/User.js";
import { SuccessResponseDto } from "../../../global/response/SuccessResponseDto.js";
import { CurrentUser } from "../decorators/Auth.Decorator.js";
import { PasswordChange } from "../dto/request/PasswordChange.js";
import { SiginUp } from "../dto/request/SignUp.js";
import { TemporaryPassword } from "../dto/request/TemporaryPassword.js";
import { UserIdentifier } from "../dto/response/UserIdentifier.js";
import { AuthService } from "../service/Auth.Service.js";
import { Body, Controller, Get, HttpCode, Logger, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "../guards/JwtAuth.Guard.js";
import { AccountService } from "../service/Account.Service.js";




@Controller("/api/auth/account")
export class AccountController {

  private readonly logger = new Logger(AccountController.name);
    constructor(
      private readonly accountService: AccountService
    ) {}


    @Post("/sign-up")
    @HttpCode(200)
    public async penetratelocalUser(
        @Body() signUp: SiginUp
    ): Promise<SuccessResponseDto<void>>  {
      await this.accountService.penetratelocalUser(signUp.geIdentifier(), signUp.getPassword(), signUp.getEmail());
      this.logger.log("로컬 회원가입 완료");
      return SuccessResponseDto.of();
    }


    @Get("/retrieve-idenfitier")
    @HttpCode(200)
    public async findIdentifier(
      @Query("email") email: string,
      @Query("code") code: string
    ): Promise<SuccessResponseDto<UserIdentifier>>  {
      const result : UserIdentifier = await this.accountService.findIdentifier(email, code);
      this.logger.log("아이디 찾기 완료");
      return SuccessResponseDto.of(result);
    }
  
  
    @Patch("/reset-password")
    @HttpCode(200)
    public async generateTemporaryPassword(
      @Body() temporaryPassword: TemporaryPassword
    ): Promise<SuccessResponseDto<void>>  {
      await this.accountService.generateTemporaryPassword(temporaryPassword.getIdentifier(), temporaryPassword.getEmail());
      this.logger.log("임시 비밀번호 생성 완료");
      return SuccessResponseDto.of();
    }
  
  
  
    @Patch("/change-password")
    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    public async changePassword(
      @Body() passwordChange: PasswordChange,
      @CurrentUser() user: User
    ): Promise<SuccessResponseDto<void>>  {
  
      await this.accountService.changePassword(user.userId, passwordChange.getOldPassword(), passwordChange.getNewPassword());
      return SuccessResponseDto.of();
    }


}