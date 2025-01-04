import {
    Body, Controller,
    Delete, Get,
    Param, Patch,
    Post, Query,
    ParseIntPipe, ValidationPipe,
    Ip
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LoggerService } from 'src/logger/logger.service';


@SkipThrottle()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    private readonly logger = new LoggerService(UsersController.name);//added logger service

    // GET /users
    @SkipThrottle({ default: false })
    @Get()
    findAll(
        @Ip() ip: string, // Get the IP address of the client
        @Query('role') role?: 'ADMIN' | 'USER',
        @Query('limit')   limit?: "all" | string
    ) {
        this.logger.log(`==================================== /T (findAll) Request from IP: ${ip}`);
        return this.usersService.findAll(role, limit);
    }

    // /get users/:id
    @Throttle({ short: { ttl: 50000, limit: 3 } })
    @Get(':id')
    findOne(
        @Ip() ip: string,
        @Param('id', ParseIntPipe) id: number
    ) {
        this.logger.log(`==================================== /T (findOne) Request from IP: ${ip}`);
        return this.usersService.findOne(id);
    }

    // POST /users
    @Throttle({ short: { ttl: 50000, limit: 3 } })
    @Post()
    create(
        @Ip() ip: string,
        @Body(ValidationPipe) user: CreateUserDto
    ) {
        this.logger.log(`==================================== /T (create) Request from IP: ${ip}`);
        return this.usersService.create(user);
    }

    // PATCH /users/:id
    @Patch(':id')
    update(
        @Ip() ip: string,
        @Param('id', ParseIntPipe) id: string, // Receive as string
        @Body(ValidationPipe) userUpdate: UpdateUserDto
    ) {
        this.logger.log(`==================================== /T (update) Request from IP: ${ip}`);
        const numericId = Number(id); // Convert to number
        return this.usersService.update(numericId, userUpdate);
    }

    // DELETE /users/:id
    @Throttle({ short: { ttl: 50000, limit: 3 } })
    @Delete(':id')
    remove(
        @Ip() ip: string,
        @Param('id', ParseIntPipe) id: string
    ) {
        this.logger.log(`==================================== /T (remove) Request from IP: ${ip}`);
        const numericId = Number(id); // Convert to number
        return this.usersService.remove(numericId);
    }

}
