import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

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
    findAll(@Query('role') role?: 'ADMIN' | 'USER', @Query('limit') limit?: number) {
        return this.usersService.findAll(role, +limit);
    }

    @Get(':id') // /get users/:id
    findOne(@Param('id') id: number) {
  
        return this.usersService.findOne(id); 
    }

    @Post() // POST /users
    create(@Body() user: { id: number, name: string, role: 'ADMIN' | 'USER' }) {
        return this.usersService.create(user); 
    }

    @Patch(':id')
    update(
      @Param('id') id: string, // Receive as string
      @Body() userUpdate: { id?: number; name?: string; role?: 'ADMIN' | 'USER' }
    ) {
      const numericId = Number(id); // Convert to number
      return this.usersService.update(numericId, userUpdate);
    }
    


    @Delete(':id')
    remove(@Param('id') id: string) {
      const numericId = Number(id); // Convert to number
      return this.usersService.remove(numericId);
    }
    
}
