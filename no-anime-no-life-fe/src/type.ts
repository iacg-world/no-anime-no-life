export interface AnimeCategoryInfo {
  categoryId: string,
  categoryName: string,
  list: AnimeInfo[],
  editing?: boolean,
}

export interface ApiAnimeCategoryInfo  {
  categoryId: string,
  categoryName: string,
  list: Partial<ApiAnimeInfo>[],
  editing?: boolean,
}

export interface GlobalStore {
  title: {
    topic_name: string,
    topic_name_cn: string,
  }

}
export type ObjectKeysToLiteral<T> = T extends object ? (keyof T) : never;
export interface SortableAnimeCategoryInfo extends AnimeCategoryInfo {
  id: string
}
export interface ApiAnimeInfo {
  'aid': string,
  'id': number,
  'url': string,
  'type': number,
  'name': string,
  'name_cn': string,
  cover: string,

}
export interface AnimeInfo {
  'aid': string,
  'id': number,
  'url': string,
  'type': number,
  'name': string,
  'name_cn': string,
  'images': {
    'large'?: string
    'common'?: string
    'medium'?: string
    'small'?: string
  }
  ossUrl?: string,
}

export interface SortableAnimeInfo extends Omit<AnimeInfo, 'id'> {
  id: string
}

export interface ResponseResult<T> {
  code: number,
  message: string,
  timestamp: number,
  data: T
}

