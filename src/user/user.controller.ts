import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { InputCreateUserDTO } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() input: InputCreateUserDTO) {
    try {
      const user = await this.userService.create(input);

      return { message: 'User created.', code: HttpStatus.CREATED, data: user };
    } catch (err) {
      return {
        message: 'An error occurred.',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
