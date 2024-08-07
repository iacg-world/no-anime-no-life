export interface AnimeCategoryInfo {
  categoryId: string,
  categoryName: string,
  list: AnimeInfo[],
  editing?: boolean,

}

export interface SortableAnimeCategoryInfo extends AnimeCategoryInfo{
  id: string
}
export interface AnimeInfo {
  'aid': string,
  'id': number,
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

export interface SortableAnimeInfo extends Omit<AnimeInfo, 'id'>{
  id: string
}

export interface ResponseResult<T> {
  code: number,
  message: string,
  timestamp: number,
  data: T
}

