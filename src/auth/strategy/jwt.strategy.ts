import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { PrismaService } from "src/auth/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET', 'default_secret'),
      
    });    
  }
  
  async validate(payload: { sub: number, email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      console.warn(`User with ID ${payload.sub} not found`);
      throw new BadRequestException('User not found in database');
    }
    
    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId
    };
  }
}
