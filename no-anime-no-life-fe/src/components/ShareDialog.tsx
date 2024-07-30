import { forwardRef, useImperativeHandle, useState, createRef} from 'react'
import { getShareList } from '../api'
import { AnimeCategoryInfo} from '../type'
import { takeScreenshot } from '../utils'
import { useRequest } from 'ahooks'
import { Button, DotLoading } from 'antd-mobile'


export interface ShareDialogProps {
  animeList: AnimeCategoryInfo[]

}

 
export type ShareDialogRef = {
  openModal: () => void;
};




export const ShareDialog = forwardRef<ShareDialogRef, ShareDialogProps>((props, ref) => {
  const getRequest = async (clear:boolean = false)=> {
    if (clear) {
      return []
    }
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

  const { data:shareAnimeList, loading, runAsync: getOssAnimeList,  } = useRequest(getRequest, {
    manual: true,
    debounceWait: 500,
    debounceLeading: true,
    
  })

  const openModal = () => {
    setIsOpen(true)
    getOssAnimeList()
  }
  useImperativeHandle(ref, () => ({
    openModal
  }))
  const closeModal = () => {
    getOssAnimeList(true)
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
      {
        isOpen ? (
      
          <div className="bg-stone-900/60 fixed top-0 left-0 w-screen h-screen flex items-center justify-center rounded-sm">
            <div className="bg-white p-1 w-4/5 min-h-1/2 max-h-screen max-w-screen flex flex-col items-center box-border overflow-scroll">
              {
                loading 
                  ?
                  <div className="flex content-center">
                    <span>生成分享中</span><DotLoading />
                  </div>
                  :    
                  <>
                    <div onDoubleClick={createImg} className="flex flex-row overflow-x-auto max-h-full min-h-full" ref={contentRef}>
                      {
                        shareAnimeList?.map(categoryItem => {
                          return (
                            <div className='flex flex-col flex-nowrap w-14' key={categoryItem.categoryId}>
                              <div className="text-sm font-sans text-nowrap">{categoryItem.categoryName}</div>
                              <div className={'flex flex-col flex-nowrap px-1'}>
                                {
                                  categoryItem.list.map(animeItem => {
                                    return (
                                      <div 
                                        className="flex flex-col items-center">
                                        <img src={animeItem.ossUrl} alt="" className="w-full h-16" />
                                        <div className="text-center text-xs whitespace-nowrap w-full overflow-hidden text-ellipsis ">{animeItem.name_cn}</div>
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
                      <Button onClick={closeModal} className="mr-1">关闭</Button>
                      <Button onClick={createImg} loading={downloadLoading} color='success' loadingText='正在下载'>下载分享图</Button>
                    </div>
                  </>
              }
            </div>
          </div>

        ): ''
      }
    </div>
    

  )
})