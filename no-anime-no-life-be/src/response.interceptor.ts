// response.dto.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getReasonPhrase } from "http-status-codes";
import { instanceToPlain } from "class-transformer";

function getCurrentTimestamp(): number {
  return Date.parse(new Date().toString()) / 1000;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    // 获取Fastify的响应对象
    const response: FastifyReply = context
      .switchToHttp()
      .getResponse<FastifyReply>();

    return next.handle().pipe(
      map((originalData: any) => {
        if (
          originalData &&
          originalData.code &&
          originalData.message &&
          "data" in originalData
        ) {
          return originalData; // 如果是，直接返回
        }

        // 获取响应状态码
        const statusCode: number = response.statusCode;
        // 获取对应状态码的标准消息
        const message: string = getReasonPhrase(statusCode);

        // 构造标准响应格式
        return {
          code: statusCode,
          message: message,
          data: instanceToPlain(originalData) || null,
          timestamp: getCurrentTimestamp(),
        };
      })
    );
  }
}