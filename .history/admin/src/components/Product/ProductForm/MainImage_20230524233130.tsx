import { useState } from 'react';
import styles from './MainImage.module.css';
import {IoMdRemoveCircle} from 'react-icons/io';

interface ImageFile {
  fileName: string,
  base64Data: string
}

interface ExtraInfoProps {
  onAdd(image: ImageFile[]): void,
  onRemove(image: ImageFile): void,
}

function MainImage({onAdd, onRemove}:ExtraInfoProps) {
  const [mainImg, setMainImg] = useState <ImageFile[]>([]);
  const handleMainImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files as FileList);
    const filePromise: Promise <ImageFile>[] = [];

    for (const file of files) {
      filePromise.push(
        new Promise <ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({fileName: file.name, base64Data: reader.result as string});
          };
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(filePromise).then((base64Files) => {
      console.log('✅',base64Files);
      setMainImg((prev) => [...prev, ...base64Files]);
      onAdd(base64Files)
    })
  }

  const removeMainImg = (file: ImageFile) => {    
    setMainImg((prevImages) => prevImages.filter((img) => img.fileName !== file.fileName));
    onRemove(file);
  }

  const renderImageList = () => {
    return(
      <ul className={styles.mainImgList}>
         {mainImg.map((file) => {
                return (
                  <div className={styles.renderedImg}>
                    <img 
                      key={file.fileName}
                      src={file.base64Data}
                      alt={file.fileName}
                      className={styles.img}                  
                    />
                    <button className={styles.removeBtn} onClick={() => removeMainImg(file)}><IoMdRemoveCircle/></button>
                  </div>                
                )
              })}
      </ul>
    )
  }

  return (
    <div className={`${styles.container} ${styles.mainImg}`}>
      <span className={` ${styles.title} ${styles.mainImg}`}>메인 이미지 (4개 이상 첨부)</span>
      <input className={styles.mainImgInput} id="mainImgInput" onChange={handleMainImg} accept="image/png, image/jpeg" multiple type="file"/>
      <div>
        {renderImageList()}
      </div>
    </div>
  );
}

export default MainImage;