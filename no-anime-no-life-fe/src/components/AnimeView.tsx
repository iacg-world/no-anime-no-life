import { createRef, FocusEvent, KeyboardEvent, useState } from 'react'
import { AnimeCategoryInfo, SortableAnimeCategoryInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory, initAnime, MoveAnimeParams, moveCategory, } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'
import SortableItem from './Drag/SortableItem'
import SortableContainer from './Drag/SortableContainer'
import { horizontalListSortingStrategy } from '@dnd-kit/sortable'
import AnimeListItem from './AnimeListItem'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import { OpenSearchAdd } from './AnimeItem'
import { Drag, FixedNav, Toast } from '@nutui/nutui-react'
import {Disk, Share} from '@nutui/icons-react'
import Uploader from './Uploader'
import { restrictToHorizontalAxis } from './Drag/utils'



export const AnimeView = () =>{
  const shareDialogRef = createRef<ShareDialogRef>()
  const contentRef = createRef<HTMLDivElement>()
  const animeList = useSelector<StateType, AnimeCategoryInfo[]>(state => state.anime) || []
  const dispatch = useDispatch()



  const addCategory = (e: FocusEvent<HTMLInputElement, Element>) => {
    const v = (e.target as HTMLInputElement).value
    if (v) {

      dispatch(
        addAnimeCategory(v)
      );
      (e.target as HTMLInputElement).value = ''
    }
  }
  const enterAddCategory = (e: KeyboardEvent<HTMLInputElement>,) => {
    if (e.key === 'Enter') { // 检查按下的是否是回车键
      const v = (e.target as HTMLInputElement).value
      if (v) {
  
        dispatch(
          addAnimeCategory(v)
        );
        (e.target as HTMLInputElement).value = ''
      }
      const contentRefDom = contentRef.current
      requestAnimationFrame(() => {
        contentRefDom?.scrollTo(999999 , 0)
      })
    }
  }

  const onShare = async () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('micromessenger') !== -1) {
    // 确认是微信浏览器
      shareDialogRef.current?.openModal()

    } else {
      shareDialogRef.current?.openModal()
    }

  }


  
  function handleAnimeListDragEnd(obj?:MoveAnimeParams) {
    if (obj) {
      dispatch(
        moveCategory(obj)
      )
    }

  }

  const genSortableAnimeCategoryInfoItems = (list: AnimeCategoryInfo[]):SortableAnimeCategoryInfo[] => {
    return list.map(item => {
      return {
        ...item,
        id: item.categoryId
      }
    })
  }
  const dialogRef = createRef<SearchAddDialogRef>()

  const openSearchAdd:OpenSearchAdd = (categoryId, data) => {
    dialogRef.current?.openModal({categoryId, animeInfo: data})
  }
  const saveJSON = () => {
    try {
      const json = JSON.stringify(animeList)
      const blob = new Blob([json], {type: 'application/json'})
  
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'anime.json'
      link.click()
      Toast.show({
        title: '保存成功',
        icon: 'success',
      })
    } catch (error) {
      Toast.show({
        title: '保存失败',
        icon: 'fail',
      })
    }

  }
  const beforeUploadJSON = (data:AnimeCategoryInfo[]) => {
    dispatch(
      initAnime(data)
    )
    Toast.show({
      title: '导入成功',
      icon: 'success'
    })

  }
  const list = [

    {
      id: 2,
      text: '保存',
      icon: <Disk />,
      func: saveJSON
    },
    {
      id: 3,
      text: '导入',
      icon: (<Uploader  onUpload={beforeUploadJSON} />),
    },
    {
      id: 1,
      text: '分享',
      icon: <Share />,
      func: onShare
    },
  ]
  const [visible, setVisible] = useState(false)
  const [draggable, setDraggable] = useState(false)
  const change = (value: boolean) => {
    setVisible(value)
    setDraggable(!value)
  }
  const selected = (
    item: any,
    event: React.MouseEvent<Element, MouseEvent>
  ) => {
    item.func?.call(event)
    setVisible(false)
  }
  return (
    <>
      <div className="flex flex-row overflow-x-auto w-full h-full" ref={contentRef}>
        <SortableContainer  
          modifiers={[restrictToHorizontalAxis]}
          strategy={horizontalListSortingStrategy} 
          items={genSortableAnimeCategoryInfoItems(animeList)} 
          onDragEnd={(obj) => {handleAnimeListDragEnd(obj ? {...obj} : undefined)}}>


          {
            animeList.map(categoryItem => {
              const {categoryId} = categoryItem
              return (
                <SortableItem key={categoryId} id={categoryId}>
                  <AnimeListItem categoryItem={categoryItem} openSearchAdd={openSearchAdd}></AnimeListItem>
                </SortableItem>
              )
            
            })

          }
        </SortableContainer>
        <div
          className="flex flex-col items-center justify-center min-w-10 h-4">
          <input 
            onKeyDown={(e) => enterAddCategory(e)}
            onBlur={addCategory} type="text" placeholder="输入新类目" maxLength={5} className="h-full w-full text-sm" />
        </div>
      </div>
      <Drag draggable={draggable} direction="y" style={{ right: '0px', bottom: '10vh' }}>
        <FixedNav
          list={list}
          overlay
          inactiveText="功能"
          activeText="收起"
          visible={visible}
          onChange={change}
          onSelect={selected}
          color='black'
        />
      </Drag>
      <ShareDialog  ref={shareDialogRef} animeList={animeList} />

      <SearchAddDialog ref={dialogRef}></SearchAddDialog>,

    </>

  )

}

