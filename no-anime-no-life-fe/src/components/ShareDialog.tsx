import { forwardRef, useImperativeHandle, useState, createRef, useEffect} from 'react'
import { getShareList } from '../api'
import { AnimeCategoryInfo} from '../type'
import { isMobile, takeScreenshot } from '../utils'
import { useRequest } from 'ahooks'
import { Button, DotLoading, Modal, Toast } from 'antd-mobile'


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
  const [width, setWidth] = useState('')
  const contentRef = createRef<HTMLDivElement>()



  const { data:shareAnimeList, loading, runAsync: getOssAnimeList,  } = useRequest(getRequest, {
    manual: true,
    debounceWait: 500,
    debounceLeading: true,
    
  })
  useEffect(() => {
    if (shareAnimeList?.length) {
      console.log(contentRef.current?.scrollWidth)
      const scrollWidth = contentRef.current?.scrollWidth
      if (scrollWidth){

        setWidth(scrollWidth + 'px')
      }
    }

  }, [shareAnimeList])
  const openModal = async () => {
    setIsOpen(true)
    try {
      await getOssAnimeList()
    } catch (error) {
      Toast.show('服务异常，请重试')
      setIsOpen(false)
      
    }
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
      try {
        if (isMobile()) {
          const url = await takeScreenshot(contentRef.current, false)
          Modal.show({
            image:url,
            title: '长按中间保存',
            actions: [],
            showCloseButton: true,
            closeOnMaskClick: true,
          })

        } else {
          await takeScreenshot(contentRef.current)
        }
        setDownloadLoading(false)

      } catch (error) {
        setDownloadLoading(false)
        Toast.show('下载失败请重试')
        
      }
    }
  }
 
  return (
    <div>
      {
        isOpen ? (
      
          <div className="bg-stone-900/60 fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-10">
            <div className="bg-white p-1 pb-4 box-border w-4/5 min-h-1/2 max-h-screen max-w-screen flex flex-col items-center rounded-sm">
              {
                loading 
                  ?
                  <div className="flex content-center">
                    <span>生成分享中</span><DotLoading />
                  </div>
                  :
                  <>
                    <div onDoubleClick={createImg} className="flex flex-col overflow-x-auto max-h-full min-h-full min-w-[50%] max-w-full" ref={contentRef}>
                      <div className="text-center" style={{width: `${width}`}}>
                        <div className="text-center font-bold text-sm">动画人生生成器</div>
                        <div className="text-center font-thin text-xs mb-1">nanf.lc404.cn</div>
                      </div>
                      <div className="flex flex-row">
                        {
                          shareAnimeList?.map(categoryItem => {
                            return (
                              <div className='flex flex-col flex-nowrap' key={categoryItem.categoryId}>
                                <div className="text-sm font-sans text-nowrap">{categoryItem.categoryName}</div>
                                <div className={'flex flex-col flex-nowrap px-1 w-14'}>
                                  {
                                    categoryItem.list.map(animeItem => {
                                      return (
                                        <div
                                          key={animeItem.aid}
                                          className="flex flex-col items-center">
                                          <img src={animeItem.ossUrl} alt="" className="w-full h-16 rounded-sm" />
                                          <div className="text-center text-xs whitespace-nowrap w-full overflow-hidden text-ellipsis ">{animeItem.name_cn || animeItem.name}</div>
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