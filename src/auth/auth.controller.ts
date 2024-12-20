import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login/with-credentials')
  @HttpCode(HttpStatus.OK)
  loginWithCredentials() {
    return { message: 'Login efetuado', code: HttpStatus.OK };
  }

  @UseGuards(AnonymousAuthGuard)
  @Post('login/anonymous')
  @HttpCode(HttpStatus.OK)
  loginAnonymous() {
    return { message: 'Login efetuado', code: HttpStatus.OK };
  }
}
