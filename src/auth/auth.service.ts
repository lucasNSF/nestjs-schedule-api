import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OutputCreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async loginWithCredentials(
    username: string,
    password: string,
  ): Promise<OutputCreateUserDTO> {
    try {
      const user = await this.userService.getUserByUsername(username);

      if (!user) throw new UnauthorizedException();

      const output: OutputCreateUserDTO = {
        id: user.id,
        email: user.email,
        username: user.username,
        isAnonymous: user.isAnonymous,
      };

      if (!user.password) return output;

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) return output;

      throw new UnauthorizedException();
    } catch (err) {
      await bcrypt.compare(password, 'invalid_password_Has$_F4r_s3curiTY');
      return null;
    }
  }

  async loginAnonymous(): Promise<OutputCreateUserDTO> {
    return this.userService.create({});
  }
}
