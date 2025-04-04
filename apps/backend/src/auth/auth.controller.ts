import { Controller, Post, Req, Body } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/dto";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthDto){   
        console.log(dto); 
        return this.authService.signup(dto);
    }

    @Post('login')
    login(@Body() dto: AuthDto){
        return this.authService.login(dto);
    }

}