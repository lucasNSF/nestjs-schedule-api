import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousAuthGuard } from './guards/anonymous-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './strategies/jwt.strategy';
import { JWTAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30s',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AnonymousStrategy,
    JWTStrategy,
    LocalAuthGuard,
    AnonymousAuthGuard,
    JWTAuthGuard,
  ],
  exports: [],
})
export class AuthModule {}
