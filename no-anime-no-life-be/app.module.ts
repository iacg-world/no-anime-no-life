// 从 '@nestjs/common' 模块中导入 Module 装饰器
import { Module } from '@nestjs/common';
// 从当前目录导入 AppController 控制器
import { AppController } from './app.controller';
import { SearchController } from './src/search/search.controller';
import { SearchService } from './src/search/search.service';
import { HttpModule } from '@nestjs/axios';
import { TransformInterceptor } from './src/response.interceptor';
import { DownloadController } from './src/download/download.controller';
import { DownloadService } from './src/download/download.service';
import { OssService } from './src/OssService';
// 使用 @Module 装饰器定义一个模块
@Module({
  // 在 controllers 属性中指定当前模块包含的控制器
  controllers: [AppController, SearchController, DownloadController],
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 10,
    }),
  ],
  providers: [
    SearchService,
    DownloadService,
    OssService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor
    }],
})
// 定义并导出 AppModule 模块
export class AppModule { }