import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AnonymousStrategy,
    LocalAuthGuard,
    AnonymousAuthGuard,
  ],
  exports: [],
})
export class AuthModule {}
