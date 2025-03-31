import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //hash password
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('idendifiant déja existant');
        }
        throw error;
      }
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
        where:  {
            email: dto.email,
        },
    });
    if(!user){
        throw new ForbiddenException('email incorrect');
    }

    const passwordMatch = await argon.verify(user.password, dto.password);
    if(!passwordMatch){
        throw new ForbiddenException('mot de passe incorrect');
    }
    
    const userWithoutPassword = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true, email: true, role: true }, // Ne pas inclure `password`
    });

    return userWithoutPassword;
  }



}
