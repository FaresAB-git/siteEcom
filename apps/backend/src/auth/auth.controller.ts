import { Controller, Post, Req, Body, Res } from "@nestjs/common";
import { Response } from 'express'; 
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

    @Post('login/admin')
    loginAdmin(@Body() dto: AuthDto){
        return this.authService.login(dto);
    }

    @Post('loginCookie/admin')
    async loginAdminWithCookie(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokenData = await this.authService.loginAdmin(dto);

    res.cookie('access_token', tokenData.access_token, {
      httpOnly: true,           // Protège contre XSS
      secure: true,             //Doit être true car Railway utilise HTTPS
      sameSite: 'none',         //Obligatoire pour autoriser cross-site cookie
      maxAge: 10 * 60 * 60 * 1000, // 10 heures
      domain: '.siteecomfares.fr',
    });

    return { message: 'Connexion réussie' };
  }

}