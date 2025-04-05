import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { getCallSites } from "node:util"

export class ProdDto {  //class et non interface pour utiliser les decorateur de class validator (voir doc nestJs pipes)

    @IsString()
    @IsNotEmpty()
    nom: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    imgPath: string;

    @IsNumber()
    @IsNotEmpty()
    prix: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

}