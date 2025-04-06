import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { getCallSites } from "node:util"

export class CollectionDto {  //class et non interface pour utiliser les decorateur de class validator (voir doc nestJs pipes)

    @IsString()
    @IsNotEmpty()
    nom: string;

    @IsString()
    @IsOptional()
    description?: string;

}