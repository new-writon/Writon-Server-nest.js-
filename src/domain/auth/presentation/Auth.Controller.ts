import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SuccessResponseDto } from '../../../global/response/SuccessResponseDto';
import { AuthService } from '../service/Auth.Service';
import { KakaoLogin } from '../dto/request/KakaoLogin';
import { LoginResponse } from '../dto/response/loginResponse';
import { CurrentUser } from '../../auth/decorators/Auth.Decorator';
import { JWTAuthGuard } from '../../auth/guards/JwtAuth.Guard';
import { User } from '../../user/domain/entity/User';
import { LocalLogin } from '../dto/request/LocalLogin';
import { Request, Response } from 'express';

@Controller('/api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('/login/kakao')
  @HttpCode(200)
  public async kakaoLogin(
    @Body() kakaoLogin: KakaoLogin,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto<LoginResponse>> {
    const result: LoginResponse = await this.authService.kakaoLogin(
      kakaoLogin.getOrganization(),
      kakaoLogin.getChallengeId(),
      req.headers['authorization'],
    );
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: true, // HTTPS 환경에서만 전송됨
      sameSite: 'strict', // CSRF 방지
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    const { accessToken, refreshToken, ...responseBody } = result;
    this.logger.log('카카오 로그인 완료');
    return SuccessResponseDto.of(responseBody as LoginResponse);
  }

  @Post('/login/local')
  @HttpCode(200)
  public async localLogin(
    @Body() loginLocal: LocalLogin,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto<LoginResponse>> {
    const result: LoginResponse = await this.authService.localLogin(loginLocal);
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
    const { accessToken, refreshToken, ...responseBody } = result;
    this.logger.log('로컬 로그인 완료');
    return SuccessResponseDto.of(responseBody as LoginResponse);
  }

  @Delete('/logout')
  @HttpCode(200)
  @UseGuards(JWTAuthGuard)
  public async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto<void>> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new BadRequestException('이미 로그아웃된 상태입니다.');
    }
    await this.authService.logout(
      String(user.userId),
      refreshToken as string,
      req.headers['engine'] as string,
    );
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    this.logger.log('로그아웃 완료');
    return SuccessResponseDto.of();
  }

  @Delete('cookie')
  async deleteTokenCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return SuccessResponseDto.of(null);
  }
}
