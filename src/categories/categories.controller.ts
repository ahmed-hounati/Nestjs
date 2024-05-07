import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto)
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoriesService.delete(id)
    }
}
