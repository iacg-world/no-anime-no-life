// 导入 Controller 和 Get 装饰器
import { Controller, Get } from '@nestjs/common';
// 使用 @Controller 装饰器标记类为控制器
@Controller()
export class AppController {
  // 构造函数，目前没有任何参数和逻辑
  constructor() { }
  // 使用 @Get 装饰器标记方法为处理 GET 请求的路由
  @Get()
  // 定义 getHello 方法，返回类型为字符串
  getHello(): string {
    // 返回字符串 'hello'
    return 'hello';
  }
}