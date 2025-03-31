import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { getCallSites } from "node:util"

export class AuthDto {  //class et non interface pour utiliser les decorateur de class validator (voir doc nestJs pipes)

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}