import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-anonymous';
import { OutputCreateUserDTO } from 'src/user/dtos/create-user.dto';

import { AuthService } from '../auth.service';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(): Promise<OutputCreateUserDTO> {
    return this.authService.loginAnonymous();
  }
}
