import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, ValidationPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
    /*
      GET /users
      GET /users/:id
      POST /users
      PATCH /users/:id
      DELETE /users/:id
      */

    constructor(private readonly usersService: UsersService) { }

    @Get() // GET /users
    findAll(@Query('role') role?: 'ADMIN' | 'USER', @Query('limit') limit?: number | string) {
        return this.usersService.findAll(role, +limit);
    }

    @Get(':id') // /get users/:id
    findOne(@Param('id', ParseIntPipe) id: number) {

        return this.usersService.findOne(id);
    }

    @Post() // POST /users
    create(@Body(ValidationPipe) user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: string, // Receive as string
        @Body(ValidationPipe) userUpdate: UpdateUserDto
    ) {
        const numericId = Number(id); // Convert to number
        return this.usersService.update(numericId, userUpdate);
    }



    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: string) {
        const numericId = Number(id); // Convert to number
        return this.usersService.remove(numericId);
    }

}
