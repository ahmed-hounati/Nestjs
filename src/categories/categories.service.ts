import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

    findAll() {
        const categories = this.categoryModel.find().exec();
        return categories;
    }

    async findOne(id: string) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException('User not found');
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const createdCategory = new this.categoryModel(createCategoryDto)
        const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name }).exec()
        if (existingCategory) {
            throw new NotFoundException('Category already found')
        }
        return await createdCategory.save();
    }


    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
        try {
            await updatedCategory;
            return "Category updated successfully";
        } catch {
            throw new NotFoundException('Category not found');
        }
    }

    async delete(id: string) {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        await this.categoryModel.findByIdAndDelete(id);
        return "Category deleted successfully";
    }
}
