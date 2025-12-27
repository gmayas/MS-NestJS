import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/sevices/prisma/prisma.service';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ProductsService {
  // Inject PrismaService to interact with the database
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    try {
      console.log('Creating product with data:', createProductDto);
      const newProduct = await this.prisma.product.create({
        data: createProductDto,
      });
      console.log('Product created successfully:', newProduct);
      return { message: 'Product created successfully', product: newProduct, statusCode: 201 };
    } catch (error) {
      console.error('Error logging createProductDto:', error);
      return { message: `Error creating product. ${error.message} .`, product: createProductDto, statusCode: 500};
    }    
  }

  async findAll() {
    try {
      console.log('Fetching all products');
      const existingProducts = await this.prisma.product.findMany();
      console.log('Products fetched:', existingProducts);
      if (existingProducts.length === 0) {
        console.log('No products found.');
        return { message: 'No products found.', products: [], statusCode: 404 };
      }
      return { message: 'Products fetched successfully', products: existingProducts, statusCode: 200 };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        message: `Error fetching products. ${error.message}.`, products: [], statusCode: 500
      }
    }
  }

  async findOne(id: number) {
    try {
      console.log('Finding product with id:', id);
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      console.log('Existing Product:', !existingProduct);
      if (!existingProduct) {
        console.log(`Product id ${id} not found.`);
        return { message: `Product id ${id} not found.`, product: {}, statusCode: 404 };
      }
      return { message: 'Product found successfully', product: existingProduct, statusCode: 200 };

    } catch (error) {
      console.error('Error logging product id:', error);
      return { message: `Error finding product. ${error.message} .`, product: {}, statusCode: 500};
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      console.log('Finding product with id:', id);
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      console.log('Existing Product:', !existingProduct);
      if (!existingProduct) {
        console.log(`Product id ${id} not found, product not updated.`);
        return { message: `Product id ${id} not found, product not updated.`, product: {}, statusCode: 404 };
      }
      console.log('Updating product with data:', updateProductDto);
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return { message: 'Product updated successfully', product: updatedProduct, statusCode: 200 };

    } catch (error) {
      console.error('Error finding product:', error);
      return { message: `Error finding product. ${error.message} .`, product: {}, statusCode: 500 };
    }
  }

  async remove(id: number) {
    try {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });
      console.log('Existing Product:', !existingProduct);
      if (!existingProduct) {
        return { message: `Product id ${id} not found, product not deleted.`, product: {}, statusCode: 404 };
      }
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      return { message: 'Product deleted successfully', product: deletedProduct, statusCode: 200 };

    } catch (error) {
      console.error('Error finding product:', error);
      return { message: `Error finding product. ${error.message} .`, product: {}, statusCode: 500 };
    }
  }
}
