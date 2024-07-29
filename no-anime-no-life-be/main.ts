// 从 @nestjs/core 模块中导入 NestFactory，用于创建 Nest 应用实例
import { NestFactory } from '@nestjs/core';
// 导入应用的根模块 AppModule
import { AppModule } from './app.module';
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.join(path.dirname(__dirname), '.env')
})
// 定义一个异步函数 bootstrap，用于启动应用
async function bootstrap() {
  // 使用 NestFactory.create 方法创建一个 Nest 应用实例，并传入根模块 AppModule
  const app = await NestFactory.create(AppModule);
  // 配置CORS白名单
  const whiteList = ['http://example.com', 'http://localhost:3000', 'http://localhost:5173'];
  app.enableCors({
    origin: (requestOrigin: string, callback: (err: Error, allow?: boolean) => void) => {
      
      if (!requestOrigin || whiteList.find(item => requestOrigin.includes(item))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  });
  // 让应用监听 3000 端口
  await app.listen(3000);
}
// 调用 bootstrap 函数，启动应用
bootstrap();