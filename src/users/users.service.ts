import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import {
  NotFoundException, BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { stat } from 'fs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,  // Inject the repository
  ) { }


  async findAll(
    role?: "ADMIN" | "USER",
    limit?: "all" | string
  ) {

    let query = this.userRepository.createQueryBuilder('user');

    if (limit) {
      if (limit === 'all') {
        console.log("LIMIT IS ALL");
        // Fetch all users without applying a limit
      } else {
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedLimit) || limit !== parsedLimit.toString()) {
          console.log('Invalid limit:', limit);
          throw new BadRequestException('Limit must be a valid number or "all"');
        }

        if (parsedLimit > await this.userRepository.count()) {
          throw new BadRequestException('Limit must be less than the total number of users');
        }

        query.take(parsedLimit);
      }
    } else {
      console.log("NO LIMIT");
    }

    if (role) {
      if (role !== 'ADMIN' && role !== 'USER') {
        throw new NotFoundException('Invalid role');
      }
      query.andWhere('user.role = :role', { role });
    }
    const users = await query.getMany();


    const finalized = {
      size: users.length,
      status: "success",
      users: users
    }

    return finalized;
  }




  async findOne(
    id: number
  ) {
    console.log('finding user with id:', id);
    const foundUser = await this.userRepository.findOne({ where: { id: id } });
    if (!foundUser) throw new NotFoundException(`User with id ${id} not found`);
    return foundUser
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.name) {
      throw new BadRequestException('Invalid name');
    }
    if (!createUserDto.role) {
      throw new BadRequestException('Invalid role');
    }
    const existingUser = await this.userRepository.findOne({ where: { name: createUserDto.name } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return { message: "User created successfully", user: newUser };
  }


  async update(
    id: number,
    userUpdateDto: UpdateUserDto
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = Object.assign(user, userUpdateDto);
    await this.userRepository.save(updatedUser);
    console.log('Updated user:', updatedUser);
    return { message: "User updated successfully", user: updatedUser };
  }


  async remove(
    id: number
  ) {
    const foundUser = this.userRepository.findOne({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (foundUser) {
      const deletedUser = await this.userRepository.delete(id);
      if (deletedUser.affected === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return {
        message: "User deleted successfully",
        status: "success",
      }
    }
    return foundUser;
  }
}
