export interface AnimeCategoryInfo {
  categoryId: string,
  categoryName: string,
  list: Partial<AnimeInfo>[]
}

export interface OSSImgInfo {
  name: string,
  url: string,
}


export interface AnimeInfo {
  'aid': string,
  'id': number,
  'name': string,
  'name_cn': string,
  'images': {
    'large': string,
    'common': string,
    'medium': string,
    'small': string,
    'grid': string
  },
  ossUrl?: string,
}

export interface LocalImgInfo {
  aid: string,
  name: string,
  id: number,
  ossUrl?: string
}