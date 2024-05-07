import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }
    

    async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            const users = await this.userModel.find({ role }).exec();
            if (users.length === 0) {
                throw new NotFoundException('Users not found');
            }
            return users;
        }
        return this.userModel.find().exec();
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new NotFoundException('Email already taken');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        await newUser.save();
        return "User created successfully";
    }


    async update(id: string, updateUserDto: UpdateUserDto) {
        const updatedUser = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
        try {
            await updatedUser;
            return "User updated successfully";
        } catch {
            throw new NotFoundException('User not found');
        }
    }

    async delete(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.userModel.findByIdAndDelete(id);
        return "User deleted successfully";
    }
}
