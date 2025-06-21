import { Body, Controller, Post } from '@nestjs/common';
import { AvisService } from './avis.service';
import { CreateAvisDto } from 'src/dto/createAvis.dto';

@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post('')
  async createAvis(@Body() avisDto: CreateAvisDto){
    return this.avisService.createAvis(avisDto)
  }
  
}
