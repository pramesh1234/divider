import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, catchError, map, throwError } from "rxjs";

interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log("Shit happens", error);
        delete error["response"]["error"];
        error["response"]["data"] = null;
        return throwError(() => error);
      }),
      map((payload) => {
        console.log("received on interceptor", payload);
        const message = payload?.message || "OK";
        delete payload["message"];
        delete payload["error"];
        const data = payload?.data || payload || null;
        const statusCode = payload?.statusCode || 200;
        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
