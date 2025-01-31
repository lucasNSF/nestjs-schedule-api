import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OutputCreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithCredentials(
    username: string,
    password: string,
  ): Promise<OutputCreateUserDTO & { accessToken: string }> {
    try {
      const user = await this.userService.getUserByUsername(username);

      if (!user) throw new UnauthorizedException();

      const output: OutputCreateUserDTO = {
        id: user.id,
        email: user.email,
        username: user.username,
        isAnonymous: user.isAnonymous,
      };

      if (!user.password) {
        const { accessToken } = this.loginWithJWT(output);

        return { ...output, accessToken };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { accessToken } = this.loginWithJWT(output);

        return { ...output, accessToken };
      }

      throw new UnauthorizedException();
    } catch (err) {
      await bcrypt.compare(password, 'invalid_password_Has$_F4r_s3curiTY');
      return null;
    }
  }

  async loginAnonymous(): Promise<OutputCreateUserDTO> {
    return this.userService.create({});
  }

  private loginWithJWT(user: OutputCreateUserDTO): { accessToken: string } {
    const payload = { sub: user.id, isAnonymous: user.isAnonymous };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
