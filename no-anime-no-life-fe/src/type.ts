export interface AnimeCategoryInfo {
  categoryId: string,
  categoryName: string,
  list: AnimeInfo[],
  editing?: boolean,

}
export interface AnimeInfo {
  'aid': string,
  'id': string | number,
  'url': string,
  'type': number,
  'name': string,
  'name_cn': string,
  'summary': string,
  'air_date': string,
  'air_weekday': number,
  'images': {
    'large': string,
    'common': string,
    'medium': string,
    'small': string,
    'grid': string
  }
  ossUrl?: string,
}

export interface ResponseResult<T> {
  code: number,
  message: string,
  timestamp: number,
  data: T
}

