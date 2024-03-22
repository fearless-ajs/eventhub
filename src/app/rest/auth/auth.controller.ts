import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/shared/create-auth.dto';
import ResponseSerializer, {
  IResponseWithData,
  IResponseWithMessage,
} from '@libs/helpers/ResponseSerializer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Guest } from '@libs/decorators/guest.decorator';
import { SignInDto } from '@app/rest/auth/dto/shared/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from '@libs/Guards/refresh-jwt/refresh-jwt.guard';
import { GetCurrentUserId } from '@libs/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from '@libs/decorators/get-current-user.decorator';
import { VerifyTokenDto } from '@app/rest/auth/dto/shared/verify-token.dto';
import { ResendTokenDto } from '@app/rest/auth/dto/shared/resed-token.dto';
import { ForgotPasswordDto } from '@app/rest/auth/dto/shared/forgot-password.dto';
import { ResetPasswordTokenDto } from '@app/rest/auth/dto/shared/reset-password-token.dto';
import { CurrentUser } from '@libs/decorators/current-user.decorator';
import { TJwtPayload } from '@libs/types';
import JwtAuthGuard from '@libs/Guards/jwt-auth/jwt-auth.guard';
import { UpdateMyProfileDto } from '@app/rest/auth/dto/shared/update-my-profile.dto';
import { SerializeResponse } from '@libs/interceptors/serialize-response.interceptor';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/shared/user.dto';
import { User } from '../users/entities/user.entity';

const allowedFileTypes = ['.jpeg', '.jpg', '.png'];

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @SerializeResponse(UserDto)
  async create(@Body() createAuthDto: CreateAuthDto): Promise<User> {
    return this.usersService.create(createAuthDto);
  }

  @Guest()
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  async login(@Body() signInDto: SignInDto): Promise<IResponseWithData> {
    const response_data = await this.authService.login(signInDto);
    const { user, access_token, refresh_token } = response_data;

    delete response_data.user.password;
    delete response_data.user.emailVerificationToken;
    delete response_data.user.passwordResetToken;

    return ResponseSerializer.data({
      accessToken: access_token,
      refreshToken: refresh_token,
      type: 'Bearer',
      accessTokenLifeSpan: this.configService.get<string>(
        'JWT_AUTH_TOKEN_EXPIRATION',
      ),
      refreshTokenLifeSpan: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      ),
      user: user,
    });
  }

  @Guest()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-access-tokens')
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<IResponseWithData> {
    const response_data = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    const { user, access_token, refresh_token } = response_data;
    return ResponseSerializer.data({
      access_token,
      refresh_token,
      user: user,
    });
  }

  @Guest()
  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() verifyTokenDto: VerifyTokenDto,
  ): Promise<IResponseWithData> {
    const response_data = await this.authService.verifyToken(
      verifyTokenDto.token,
    );

    const { user, access_token, refresh_token } = response_data;

    delete response_data.user.password;
    delete response_data.user.emailVerificationToken;
    delete response_data.user.passwordResetToken;
    delete response_data.user.refreshToken;

    return ResponseSerializer.data({
      accessToken: access_token,
      refreshToken: refresh_token,
      type: 'Bearer',
      accessTokenLifeSpan: this.configService.get<string>(
        'JWT_AUTH_TOKEN_EXPIRATION',
      ),
      refreshTokenLifeSpan: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      ),
      user: user,
    });
  }

  @Guest()
  @Post('resend-email-verification-token')
  @HttpCode(HttpStatus.OK)
  async resendToken(
    @Body() resendTokenDto: ResendTokenDto,
  ): Promise<IResponseWithMessage> {
    await this.authService.resendToken(resendTokenDto.email);
    return ResponseSerializer.message('Token resent.');
  }

  @Guest()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IResponseWithMessage> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return ResponseSerializer.message('Reset Token sent.');
  }

  @Guest()
  @Post('verify-password-reset-token')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordResetPassword(
    @Body() verifyTokenDto: VerifyTokenDto,
  ): Promise<IResponseWithMessage> {
    const { email, token } = verifyTokenDto;
    await this.authService.verifyResetPasswordWithTokenAndEmail(email, token);
    return ResponseSerializer.message('Password reset Token valid.');
  }

  @Guest()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordTokenDto: ResetPasswordTokenDto,
  ): Promise<IResponseWithMessage> {
    await this.authService.resetPassword(resetPasswordTokenDto);
    return ResponseSerializer.message('Password reset successfully.');
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @GetCurrentUserId() userId: number,
  ): Promise<IResponseWithMessage> {
    await this.authService.logout(userId);
    return ResponseSerializer.message('Logged out user successfully.');
  }

  @Get('my-profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async myProfile(
    @CurrentUser() user: TJwtPayload,
  ): Promise<IResponseWithData> {
    const response_data = await this.authService.myProfile(user.userId);

    delete response_data.password;
    delete response_data.emailVerificationToken;
    delete response_data.passwordResetToken;
    delete response_data.refreshToken;

    return ResponseSerializer.data(response_data);
  }

  @Patch('update-my-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
          callback(null, true);
        } else {
          return callback(
            new UnprocessableEntityException(
              'Invalid file type, only .jpeg and .png files are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  @SerializeResponse(UserDto)
  async updateMyProfile(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @CurrentUser() user: TJwtPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 3000000,
          message: 'Max file size allowed is 2MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    picture: Express.Multer.File,
  ): Promise<User> {
    updateMyProfileDto.picture = picture;
    return this.usersService.updateUserProfile(user.userId, updateMyProfileDto);
  }
}
