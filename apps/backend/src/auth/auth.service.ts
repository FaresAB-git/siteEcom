import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService, // Injecte ConfigService
  ) {}

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
      return this.signToken(user.id, user.email);
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
        where: { email: dto.email },
    });

    if (!user) {
        throw new ForbiddenException('email incorrect');
    }


    const passwordMatch = await argon.verify(user.password, dto.password);
    if (!passwordMatch) {
        throw new ForbiddenException('mot de passe incorrect');
    }
   
    return this.signToken(user.id, user.email);
}

async loginAdmin(dto: AuthDto) {
  const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
  });

  if (!user) {
      throw new ForbiddenException('email incorrect');
  }


  const passwordMatch = await argon.verify(user.password, dto.password);
  if (!passwordMatch) {
      throw new ForbiddenException('mot de passe incorrect');
  }

  if (user.role !== 'ADMIN') {
    throw new ForbiddenException("vous n'avez pas les droits");
  }


 
  return this.signToken(user.id, user.email);
}


  async signToken(userId: number, email: string):Promise<{access_token: string}>{
    const payload = {
      sub: userId,
      email
    }

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    })

    return{
      access_token:token
    };
    
  }

}
