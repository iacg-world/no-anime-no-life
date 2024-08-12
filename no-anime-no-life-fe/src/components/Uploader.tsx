import { FC } from 'react'
import { Upload } from '@nutui/icons-react'
import { AnimeCategoryInfo } from '../type'
import { Toast } from '@nutui/nutui-react'
import { checkAnimeData } from '../utils'
interface PropsType {
  onUpload: (data:AnimeCategoryInfo[]) => void,
}
const Uploader:FC<PropsType> = (props) => {

  const handleFileChange = (event:any) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    if (file.type !== 'application/json') {
      return
    }

    const reader = new FileReader()
    reader.onload = (e:any) => {
      try {
        const data:AnimeCategoryInfo[] = JSON.parse(e.target?.result)
        if (checkAnimeData(data)) {
          props.onUpload(data)

        } else {
          Toast.show({
            title: '文件格式有误',
            icon: 'fail'
          })
        }
      } catch (err) {
        Toast.show({
          title: '请选择JSON文件'
        })
      } finally {
        event.target.value = ''
      }
    }

    reader.onerror = () => {
    }

    reader.readAsText(file)
  }

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        id="file-input"
        style={{ display: 'none' }} // 隐藏文件输入框
      />
      <label htmlFor='file-input'>
        <Upload />
      </label>
    </div>
  )
}

export default Uploader
