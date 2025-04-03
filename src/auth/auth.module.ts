import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { RefreshTokenStrategy } from "./strategy/refresh-jwt.strategy";


@Module({
    imports: [JwtModule.register({
    })],
    controllers: [AuthController],
    // providers: [AuthService, JwtStrategy]
    providers: [AuthService, RefreshTokenStrategy, JwtStrategy]
})
export class AuthModule {
    
}