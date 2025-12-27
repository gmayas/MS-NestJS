import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // Handle message pattern for creating a product
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Handle message pattern for retrieving all products
  @MessagePattern({ cmd: 'get_all_products' })
  findAll() {
    return this.productsService.findAll();
  }

  // Handle message pattern for retrieving a product by ID
  @MessagePattern({ cmd: 'get_product_by_id' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // Handle message pattern for updating a product
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // Handle message pattern for deleting a product
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
