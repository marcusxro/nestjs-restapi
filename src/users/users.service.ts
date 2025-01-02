import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, name: 'John Doe', role: 'ADMIN' },
        { id: 2, name: 'Jane Doe', role: 'USER' },
        { id: 3, name: 'Jim Doe', role: 'USER' },
        { id: 4, name: 'Josh Doe', role: 'USER' },
        { id: 5, name: 'Jill Doe', role: 'USER' },
        { id: 6, name: 'Jack Doe', role: 'USER' },
        { id: 7, name: 'Jen Doe', role: 'USER' },
        { id: 8, name: 'Jude Doe', role: 'USER' },
        { id: 9, name: 'Jade Doe', role: 'USER' },
        { id: 10, name: 'Jules Doe', role: 'USER' },
    ];


    findAll(role?: "ADMIN" | "USER", limit?: number | string) {
        let filteredUsers = this.users;

        // If limit is provided, validate it

        console.log('limit:', limit);
        if (limit) {
            const parsedLimit = parseInt(limit.toString(), this.users.length);
        
            if (isNaN(parsedLimit)) {
            console.log('Invalid limit:', limit);  // Log the invalid limit value
            throw new BadRequestException('Limit must be a valid number');
            }

            if(parsedLimit > this.users.length) {
                throw new BadRequestException('Limit exceeds total number of users');
            }

            filteredUsers = filteredUsers.slice(0, parsedLimit);
        } else if (limit === 0 || limit === undefined) {
            // If no limit is provided, simply return all users
            console.log('No limit provided, returning all users');
            limit = this.users.length;
        } else {
            console.log('Invalid limit:', limit);  // Log the invalid limit value
            throw new BadRequestException('Limit must be a valid number');
        }
        
        
        // Filter by role if provided
        if (role) {
            if (role !== 'ADMIN' && role !== 'USER') {
                throw new NotFoundException('Invalid role');
            }

            filteredUsers = filteredUsers.filter(user => user.role === role);
        }

        // Return the filtered users
        return filteredUsers;

    }

    findOne(id: number) {
        console.log('finding user with id:', id);
        const foundUser = this.users.find(user => user.id === parseInt(id.toString()));

        if (!foundUser) throw new NotFoundException(`User with id ${id} not found`);



        return foundUser
    }

    create(user: CreateUserDto) {
        if (!user.name) {
            return 'Invalid name';
        }
        if (!user.role) {
            return 'Invalid role';
        }

        const isAlreadyExist = this.users.find(u => u.name === user.name);
        if (isAlreadyExist) {
            return 'User already exists';
        }

        const newUser = {
            id: this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1, // Auto-generate ID
            ...user, // Copy other properties from CreateUserDto
        };

        this.users.push(newUser);
        return newUser;
    }


    update(id: number, userUpdate: UpdateUserDto) {
        const index = this.users.findIndex(user => user.id === id);
        if (index === -1) {
            throw new Error(`User with id ${id} not found`);
        }

        const updatedUser = { ...this.users[index], ...userUpdate };
        this.users[index] = updatedUser;

        console.log('updated user:', updatedUser);

        return updatedUser;
    }


    remove(id: number) {
        const foundUser = this.findOne(id);
        this.users = this.users.filter(user => user.id !== id);
        return foundUser;
    }

    findByRole(role: string) {
        return this.users.filter(user => user.role === role);
    }
}
