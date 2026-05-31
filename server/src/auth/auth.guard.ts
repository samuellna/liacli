import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface RequestWithUser extends Request {
  user: DecodedIdToken;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebase: typeof admin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Token não informado');

    const [, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('Token mal formatado');

    try {
      const decoded = await this.firebase.auth().verifyIdToken(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
