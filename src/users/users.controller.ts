import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
    /*
      GET /users
      GET /users/:id
      POST /users
      PATCH /users/:id
      DELETE /users/:id
      */

    @Get() // GET /users
    findAll(@Query('role') role?: 'ADMIN' | 'USER', @Query('limit') limit = 100) {
        return {role, limit}; // 'This action returns all users';
    }


    @Get(':id') // /get users/:id
    findOne(@Param('id') id: number) {

        if(typeof(id) === 'string') {
            return `This action is not allowed`;
        }

        return { id }; // `This action returns a #${id} user`;
    }

    @Post() // POST /users
    create(@Body() user: {}) {
        return user // 'This action adds a new user';
    }

    @Patch(':id') // /get users/:id
    update(@Param('id') id: number, @Body() userUpdate: {}) {
        return { id, ...userUpdate }; // `This action returns a #${id} user`;
    }


    @Delete(':id') // /get users/:id
    remove(@Param('id') id: number) {
        return { id }; // `This action removes a #${id} user`;
    }
}
