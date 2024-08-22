import { createRef, FocusEvent, KeyboardEvent, useState } from 'react'
import { AnimeCategoryInfo, AnimeInfo, SortableAnimeCategoryInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory, initAnime, insertAnime, moveAnime, MoveAnimeParams, moveCategory, rmAnime, } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'
import AnimeListItem from './AnimeListItem'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import AnimeItem, { OpenSearchAdd } from './AnimeItem'
import { Animate, Drag, FixedNav, Toast } from '@nutui/nutui-react'
import {Disk, Share} from '@nutui/icons-react'
import Uploader from './Uploader'
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MeasuringStrategy, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { createPortal } from 'react-dom'
import { useDebounceFn } from 'ahooks'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import SortableItem from './Drag/SortableItem'

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


  
  function handleAnimeListDragEnd(obj:MoveAnimeParams) {
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

  const sensors = useSensors(

    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        distance: 6,
        tolerance: 2
      }
    })
  )


  const [activeAnimeItem, setActiveItem] = useState<AnimeInfo>()
  function handleDragStart(event:DragStartEvent) {
    const { active } = event
    const { id } = active
    const categoryIds = animeList.map(item => item.categoryId)
    if (categoryIds.includes(active.id as string)) {
      setActiveItem(undefined)
      return
    }
    let allAnimeList:AnimeInfo[] = []
    animeList.forEach(item => allAnimeList = allAnimeList.concat(item.list))
    
    const activeAnimeItem = allAnimeList.find(item => item.aid === id)
    setActiveItem(activeAnimeItem)
  }
  const findContainer = (id:UniqueIdentifier | undefined) => {
    if (!id) {
      return undefined
    }
    const animeCategoryItem = animeList.find(item => item.categoryId === id)
    if (animeCategoryItem) {
      return animeCategoryItem
    } else {
      const animeCategoryItem = animeList.find(item => {
        return item.list.find(anime => anime.aid === id)
        
      })
      return animeCategoryItem

    }

  }
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    const { id } = active
    const { id: overId } = over || {}
    const categoryIds = animeList.map(item => item.categoryId)
    if (categoryIds.includes(active.id as string)) {
      return
    }
    
    const activeContainer = findContainer(id)
    const overContainer = findContainer(overId)
    if (
      !overId ||
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return
    }
    
    const activeItem = activeContainer.list.find(item => item.aid === id)
    if (!activeItem) {
      return
    }

    const activeIds = activeContainer.list.map(item => item.aid)
    const overIds = overContainer.list.map(item => item.aid)
    const activeIndex = activeIds.indexOf(id as string)
    const overIndex = overIds.indexOf(overId as string)
    let newIndex
    if (overId in overIds) {
      newIndex = overIds.length + 1
    } else {
      const isBelowOverItem =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.top >
        over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newIndex =
      overIndex >= 0 ? overIndex + modifier : overIds.length + 1
    }
    
    dispatch(
      rmAnime({
        categoryId: activeContainer.categoryId,
        deleteIndex: activeIndex
      })
    )
    dispatch(
      insertAnime({
        categoryId: overContainer.categoryId,
        anime: activeItem,
        newIndex: newIndex
      })
    )
    
  }
  const {run: handleDragOverDebounce} = useDebounceFn(handleDragOver, {
    leading: true,
    trailing: false,
    wait: 100
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over?.id)


    
    if (!activeContainer || !overContainer || !over) {
      return
    }
    const categoryIds = animeList.map(item => item.categoryId)
    if (categoryIds.includes(active.id as string)) {
      const categoryIds = animeList.map(item => item.categoryId)
      if (categoryIds.includes(active.id as string)) {
        const oldIndex = categoryIds.indexOf(active.id as string)
        const newIndex = categoryIds.indexOf(over.id as string)
  
        handleAnimeListDragEnd({
          newIndex,
          oldIndex,
          categoryId: activeContainer.categoryId
        })
  
      }
      return
    }

    const activeIds = activeContainer.list.map(item => item.aid)

    const oldIndex = activeIds.findIndex(a => a  === active.id)
    const newIndex = activeIds.findIndex(a => a === over.id)
    dispatch(
      moveAnime({categoryId: activeContainer.categoryId, oldIndex, newIndex})
    )
    setActiveItem(undefined)

  }


  const sortableAnimeCategoryInfoItems = genSortableAnimeCategoryInfoItems(animeList)
  return (
    <>
      <div ref={contentRef}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOverDebounce}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <SortableContext id="view" items={sortableAnimeCategoryInfoItems} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-row overflow-x-auto w-full h-full">
              <>
                {
                  sortableAnimeCategoryInfoItems.map(categoryItem => {
                    const {categoryId} = categoryItem
                    return (
                      <SortableItem handle key={categoryId} id={categoryId}>

                        <AnimeListItem key={categoryId} id={categoryId} categoryItem={categoryItem} openSearchAdd={openSearchAdd}></AnimeListItem>
                      </SortableItem>


                    )
            
                  })

                }
                <div
                  className="flex flex-col items-center justify-center min-w-10 h-4">
                  <input 
                    onKeyDown={(e) => enterAddCategory(e)}
                    onBlur={addCategory} type="text" placeholder="输入新类目" maxLength={5} className="h-full w-full text-sm" />
                </div>
              </>

            </div>


          </SortableContext>
          {
            createPortal(
          
              <DragOverlay>
                {
                  activeAnimeItem  ?
                    <Animate type="breath" loop>
                      <div className="rotate-6 scale-90"><AnimeItem animeItem={activeAnimeItem}></AnimeItem></div>

                    </Animate>
                    :
                    null
                }
              </DragOverlay>,
              document.body
            )
          }

        </DndContext>



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

