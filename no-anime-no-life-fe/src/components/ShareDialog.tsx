import { forwardRef, useImperativeHandle, useState, createRef, useEffect} from 'react'
import { getShareList } from '../api'
import { AnimeCategoryInfo, GlobalStore} from '../type'
import { isMobile, takeScreenshot } from '../utils'
import { useRequest } from 'ahooks'
import { useSelector } from 'react-redux'
import { StateType } from '../store'
import { Button, Dialog, Image, Loading, Toast } from '@nutui/nutui-react'


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
    if (list.every(item => item.list.length === 0)) {
      throw '至少添加一个动画'
    }
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
  const global = useSelector<StateType, GlobalStore>(state => {
    return state.global
  }) || {}


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
      Toast.show(error || '服务异常，请重试')
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
          Dialog.alert({
            title: '长按图片保存',
            content: <Image src={url} />,
            hideCancelButton: true,
            confirmText: '完成',
            style: {
              width: '90vw'
            }
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
    <Dialog
      className='p-1 w-[90vw]'
      visible={isOpen}
      onClose={closeModal} lockScroll
      footer={
        <div className="flex content-center mt-1 w-full justify-end px-2">
          <Button onClick={closeModal} className="mr-1">关闭</Button>
          <Button onClick={createImg} loading={downloadLoading} type="success">
        下载分享图
          </Button>
        </div>
      }
    >

      <div className="bg-white pb-4 box-border min-h-1/2 max-h-screen max-w-screen flex flex-col items-center rounded-sm">
        {
          loading 
            ?
            <div className="flex content-center">
              <Loading direction="vertical">生成分享中</Loading>
            </div>
            :
            <>
              <div onDoubleClick={createImg} className="flex flex-col overflow-x-auto max-h-full min-h-full min-w-[50%] max-w-full px-1" ref={contentRef}>
                <div className="text-center" style={{width: `${width}`}}>
                  <div className="text-center font-bold text-base">{global.title.topic_name}</div>
                  <div className="text-center font-thin text-xs mb-1">{global.title.topic_name_cn}</div>
                </div>
                <div className="flex flex-row">
                  {
                    shareAnimeList?.map(categoryItem => {
                      return (
                        <div className='flex flex-col flex-nowrap' key={categoryItem.categoryId}>
                          <div className="text-sm font-sans text-nowrap">{categoryItem.categoryName}</div>
                          <div className={'flex flex-col flex-nowrap pr-1 w-12 box-border'}>
                            {
                              categoryItem.list.map(animeItem => {
                                return (
                                  <div
                                    key={animeItem.aid}
                                    className="flex flex-col items-center">
                                    <img src={animeItem.ossUrl} alt="" className="w-full h-14 rounded-sm" />
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
            </>
        }
      </div>
    </Dialog>

    

  )
})