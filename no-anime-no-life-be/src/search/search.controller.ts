// 导入 Controller 和 Get 装饰器
import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
// 使用 @Controller 装饰器标记类为控制器
@Controller('s')
export class SearchController {
  constructor(private searchService: SearchService) {}
  // 使用 @Get 装饰器标记方法为处理 GET 请求的路由
  @Get(':keyword')
  // 定义 getHello 方法，返回类型为字符串
  async findAllByKeyword(@Param('keyword') keyword: string): Promise<[]> {
    try {
      const res = await this.searchService.findAll(keyword)
      return res.list || []
    } catch (error) {
      throw 'api error'
    }
  }
}