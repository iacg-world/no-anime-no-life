export interface AnimeCategoryInfo {
  categoryId: string,
  categoryName: string,
  list: Partial<AnimeInfo>[]
}


export interface AnimeInfo {
  'aid': string,
  'id': number,
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
}