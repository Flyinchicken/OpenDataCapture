import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request } from 'express';

import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginRequestDto } from './dto/login-request.dto';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

@ApiTags('Authentication')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Request an access token using credentials' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RouteAccess('public')
  login(
    @Body() { username, password, fingerprint }: LoginRequestDto,
    @Req() request: Request
  ): Promise<AccessTokenDto> {
    return this.authService.login(username, password, fingerprint, request.ip);
  }
}
