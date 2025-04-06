import { Body, Controller, Post } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionDto } from 'src/dto/collection.dto';
import { CollectionResponseDto } from 'src/dto/collection-response.dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('')
  async createCollection(@Body() collection: CollectionDto): Promise<CollectionResponseDto>{
    return this.collectionService.createCollection(collection);
  }

}
