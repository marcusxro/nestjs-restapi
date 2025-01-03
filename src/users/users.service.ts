import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,  // Inject the repository
  ) { }



  async findAll(role?: "ADMIN" | "USER", limit?: number | string) {
    let query = this.userRepository.createQueryBuilder('user');  // Create a query builder for UserEntity

    // If limit is provided, validate it
    if (limit) {
      const parsedLimit = parseInt(limit.toString(), 10); // Ensure it's a valid number

      if (isNaN(parsedLimit)) {
        console.log('Invalid limit:', limit);
        throw new BadRequestException('Limit must be a valid number');
      }

      // Set the limit on the query
      query.take(parsedLimit);
    } else {
      // If no limit is provided, return all users
      console.log('No limit provided, returning all users');
    }

    // Filter by role if provided
    if (role) {
      if (role !== 'ADMIN' && role !== 'USER') {
        throw new NotFoundException('Invalid role');
      }

      // Apply the role filter in the query
      query.andWhere('user.role = :role', { role });
    }

    // Execute the query and return the results
    const users = await query.getMany(); // Get many users matching the filters

    return users;
  }

  async findOne(id: number) {
    console.log('finding user with id:', id);
    const foundUser = await this.userRepository.findOne({ where: { id: id } });

    if (!foundUser) throw new NotFoundException(`User with id ${id} not found`);

    return foundUser
  }

  async create(createUserDto: CreateUserDto) {
    // Validate user data
    if (!createUserDto.name) {
      throw new BadRequestException('Invalid name');
    }
    if (!createUserDto.role) {
      throw new BadRequestException('Invalid role');
    }

    // Check if the user already exists by name
    const existingUser = await this.userRepository.findOne({ where: { name: createUserDto.name } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Create a new user entity
    const newUser = this.userRepository.create(createUserDto);

    // Save the new user to the database
    await this.userRepository.save(newUser);

    // Return the newly created user
    return { message: "User created successfully", user: newUser };
  }


  async update(id: number, userUpdateDto: UpdateUserDto) {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update the user with the new data
    const updatedUser = Object.assign(user, userUpdateDto);

    // Save the updated user to the database
    await this.userRepository.save(updatedUser);

    // Log the updated user for debugging purposes (optional)
    console.log('Updated user:', updatedUser);

    // Return the updated user
    return { message: "User updated successfully", user: updatedUser };
  }


  async remove(id: number) {
    const foundUser = this.userRepository.findOne({ where: { id } });

    if(!foundUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if(foundUser) {
      const deletedUser = await this.userRepository.delete(id);

      if(deletedUser.affected === 0) {
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
