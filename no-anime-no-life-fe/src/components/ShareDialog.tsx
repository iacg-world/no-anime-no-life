import { forwardRef, useImperativeHandle, useState, FunctionComponent, FC, useEffect, createRef} from 'react'
import { getShareList, searchByKeyword } from '../api'
import { AnimeCategoryInfo, AnimeInfo, ResponseResult } from '../type'
import { takeScreenshot } from '../utils'
import { useRequest } from 'ahooks'
import { Button } from 'antd-mobile'


export interface ShareDialogProps {
  animeList: AnimeCategoryInfo[]

}

interface AddInfo {
  categoryId: string,
  animeInfo?: AnimeInfo
}
 
export type ShareDialogRef = {
  openModal: () => void;
};




export const ShareDialog = forwardRef<ShareDialogRef, ShareDialogProps>((props, ref) => {
  const getRequest = async ()=> {
    const list = props.animeList
    const data = await getShareList(list)
    if (data.data) {
      return data.data.data
    } else {
      return []

    }
  } 
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = createRef<HTMLDivElement>()

  const { data:shareAnimeList, loading, runAsync: setOssAnimeList } = useRequest(getRequest, {
    manual: true,
    debounceWait: 500,
  })

  const openModal = () => {
    setIsOpen(true)
    setOssAnimeList()
  }
  useImperativeHandle(ref, () => ({
    openModal
  }))
  const closeModal = () => {
    setIsOpen(false)
  }

  const [downloadLoading, setDownloadLoading] = useState(false)
  const createImg = async () => {
    setDownloadLoading(true)
    if (contentRef.current) {
      await takeScreenshot(contentRef.current)
      setDownloadLoading(false)
    }
  }
 
  return (
    <div>
      {isOpen && (
        <div className="bg-stone-900/60 fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          <div className="bg-white p-1 w-4/5 min-h-1/2 max-h-screen max-w-screen flex flex-col items-center box-border overflow-scroll">
            <div onDoubleClick={createImg} className="flex flex-row overflow-x-auto max-h-full w-full min-h-full" ref={contentRef}>
              {
                shareAnimeList?.map(categoryItem => {
                  return (
                    <div className='flex flex-col flex-nowrap min-w-12 max-w-16' key={categoryItem.categoryId}>
                      <div className="text-sm font-sans text-nowrap">{categoryItem.categoryName}</div>
                      <div className={'flex flex-col flex-nowrap px-1'}>
                        {
                          categoryItem.list.map(animeItem => {
                            return (
                              <div 
                                className="flex flex-col items-center mb-1">
                                <img src={animeItem.ossUrl} alt="" className="w-full h-auto" />
                                <div className="flex flex-row text-xs">{animeItem.name_cn}</div>
                              </div>
                            )
                          })
                        }

                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="flex content-center">
              <Button onClick={closeModal}>关闭</Button>
              <Button onClick={createImg} loading={downloadLoading} color='success' loadingText='正在下载'>下载</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    

  )
})