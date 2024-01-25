import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RequestService } from "src/request.service";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly requestService: RequestService) {}
  use(req: Request, res: Response, next: NextFunction) {
    // Authenticate Request
    const userId = "123";
    this.requestService.setUserId(userId);
    next();
  }
}
