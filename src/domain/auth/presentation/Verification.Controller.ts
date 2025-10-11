import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto';
import { AuthenticationCodeRequest } from '../dto/request/AuthenticationCodeRequest';
import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationCodeResponse } from '../dto/response/AuthenticationCodeResponse';
import { VerifyAuthenticationCode } from '../dto/request/VerifyAuthenticationCode';
import { Token } from '../dto/response/Token';
import { Request, Response } from 'express';
import { VerificationService } from '../service/Verifiaction.Service';

@Controller('/api/auth/verification')
export class VerificationController {
  private readonly logger = new Logger(VerificationController.name);
  constructor(private readonly verificationService: VerificationService) {}

  @Post('/email-code')
  @HttpCode(200)
  public async issueAuthenticationCode(
    @Body() auththenticationCode: AuthenticationCodeRequest,
  ): Promise<SuccessResponseDto<AuthenticationCodeResponse>> {
    const result = await this.verificationService.issueAuthenticationCode(
      auththenticationCode.getEmail(),
    );
    this.logger.log('인증코드 발급 완료');
    return SuccessResponseDto.of(result);
  }

  @Post('/email-code/verify')
  @HttpCode(200)
  public async verifyAuthenticationCode(
    @Body() auththenticationCode: VerifyAuthenticationCode,
  ): Promise<SuccessResponseDto<void>> {
    await this.verificationService.verifyAuthenticationCode(
      auththenticationCode.getEmail(),
      auththenticationCode.getCode(),
    );
    this.logger.log('인증코드 검증 완료');
    return SuccessResponseDto.of();
  }

  @Post('/token-reissue')
  @HttpCode(200)
  public async reissueToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto<Token>> {
    const refreshToken = req.cookies['refresh_token'];
    const accessToken = req.cookies['access_token'];
    if (!refreshToken || !accessToken) {
      throw new UnauthorizedException('token not found');
    }
    const result = await this.verificationService.reissueToken(accessToken, refreshToken);
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    this.logger.log('토큰 재발급 완료');
    return SuccessResponseDto.of(null);
  }
}
