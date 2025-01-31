import {
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login/with-credentials')
  @HttpCode(HttpStatus.OK)
  loginWithCredentials(@Req() { user }: Request) {
    if (!user) {
      throw new InternalServerErrorException();
    }

    const { accessToken } = user as { accessToken: string };

    return { message: 'Login efetuado', code: HttpStatus.OK, accessToken };
  }

  @UseGuards(AnonymousAuthGuard)
  @Post('login/anonymous')
  @HttpCode(HttpStatus.OK)
  loginAnonymous() {
    return { message: 'Login efetuado', code: HttpStatus.OK };
  }
}
