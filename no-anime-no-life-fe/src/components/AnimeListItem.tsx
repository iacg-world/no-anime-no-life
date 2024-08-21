import { createRef, FC, FocusEvent, KeyboardEvent, useContext } from 'react'
import { AnimeCategoryInfo, AnimeInfo, SortableAnimeInfo } from '../type'
import { useClickAway } from 'ahooks'
import { modifyCategory, rmAnime } from '../store/anime'
import { useDispatch } from 'react-redux'
import SortableContainer from './Drag/SortableContainer'
import SortableItem, { DragContext } from './Drag/SortableItem'
import AnimeItem, { OpenSearchAdd } from './AnimeItem'
import { useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {AddRectangle, RemoveRectangle} from '@nutui/icons-react'
import { CSS } from '@dnd-kit/utilities'

interface PropsType {
  categoryItem: AnimeCategoryInfo,
  id: string,
  openSearchAdd: OpenSearchAdd
}
const genSortableAnimeItems = (list: AnimeInfo[]):SortableAnimeInfo[] => {
  return list.map(item => {
    return {
      ...item,
      id: item.aid
    }
  })
}
const AnimeListItem:FC<PropsType> = (props) => {
  const {categoryItem, openSearchAdd, id} = props
  const {categoryId, editing} = categoryItem
  const editInputRef = createRef<HTMLInputElement>()
  const {isDragging, activeId} = useContext(DragContext)
  const sortableAnimeItems = genSortableAnimeItems(categoryItem.list)

  const dispatch = useDispatch()
  let lastCategoryId = ''
  const onEditCategory = (data: AnimeCategoryInfo) => {
    lastCategoryId = data.categoryId
    
    dispatch(
      modifyCategory({categoryId: data.categoryId, editing: true})
    )

  }
  const deleteAnime = (categoryId:string) => {

    dispatch(
      rmAnime({categoryId})
    )
  }


  const modifyCategoryName = (e: FocusEvent<HTMLInputElement, Element>, data: AnimeCategoryInfo) => {
    dispatch(
      modifyCategory({...data, categoryName: (e.target as HTMLInputElement).value, editing: false})
    )

  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, data: AnimeCategoryInfo) => {
    
    if (e.key === 'Enter') { // 检查按下的是否是回车键
      dispatch(
        modifyCategory({...data, categoryName: (e.target as HTMLInputElement).value, editing: false})
      )
    }

  }

  useClickAway(
    () => {
      dispatch(
        modifyCategory({categoryId: lastCategoryId, editing: false})
      )
    },
    () => editInputRef.current
  )
  const activeClassStr = `flex flex-col flex-nowrap w-14 h-auto mx-1 ${activeId===categoryId ? 'scale-x-110': ''}`
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
  })



  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={activeClassStr} key={categoryId}>
        <div ref={editInputRef}>
          {
            editing
              ?
              <input
                autoFocus
                onKeyDown={(e) => handleKeyDown(e, categoryItem)}
                onBlur={(e) => modifyCategoryName(e, categoryItem)}
                data-id={categoryId} defaultValue={categoryItem.categoryName}
                type="text" placeholder="编辑类目" maxLength={5}
                className="h-4 w-full text-sm" />
              :
              <div className="text-sm font-sans text-nowrap font-bold"
                ref={editInputRef}
                onClick={() => onEditCategory(categoryItem)} >{categoryItem.categoryName}
              </div>
          }
        </div>


        <div className='flex flex-col flex-nowrap overflow-y-auto overflow-x-hidden h-[80vh] relative' style={{touchAction: isDragging ?'none' : 'auto'}} >
          <SortableContainer
            id={id}
            strategy={verticalListSortingStrategy}
            items={sortableAnimeItems}
          >
            <div>
              <>
                {
                  categoryItem.list.map(animeItem => {
                    const {aid} = animeItem
                    return (
                      <SortableItem key={aid} id={aid}>
                        <AnimeItem categoryId={categoryId} animeItem={animeItem} openSearchAdd={openSearchAdd} ></AnimeItem>
                      </SortableItem>
                    )
                  })
                }
                <div
                  className="flex flex-nowrap items-center justify-around"
                >
                  <RemoveRectangle
                    color="#fa2c19"
                    width="0.8rem"
                    height="0.8rem"
                    onClick={(e) => {e.stopPropagation();deleteAnime(categoryId)}}
                  />
                  <AddRectangle
                    color="#76c6b8"
                    width="0.8rem"
                    height="0.8rem"
                    onClick={() => openSearchAdd(categoryId)}
                  />

                </div>
              </>

            </div>

          </SortableContainer>




        </div>
      </div>

      
    </>

  )
}

export default AnimeListItem