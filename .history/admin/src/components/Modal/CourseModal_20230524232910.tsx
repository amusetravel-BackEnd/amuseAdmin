import { useState } from 'react';
import styles from './CourseModal.module.css';

interface ImageFile {
  fileName: string,
  base64Data: string
}

type Location  = {
  latitude: string,
  longitude: string
}

interface Course {
  title: string;
  timeCost: string;
  location: Location;
  content: string;
  image: ImageFile;
}

type MordalProps = {
  onSave(course:Course): void,
  onToggle(): void
};

function CourseModal({onSave, onToggle}: MordalProps) {
  const [title, setTitle] = useState<string>('');
  const [timeCost, setTimeCost] = useState<string>('');
  const [location, setLocation] = useState<Location>({
    latitude: '',
    longitude: ''
  });

  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<ImageFile | undefined>();
  
  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.currentTarget.value);
  };

  const handleTimeCost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeCost(event.currentTarget.value);
  };

  const handleLatitude = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation((prev) => ({
      ...prev,
      latitude: event.target.value
    }))
  }

  const handleLongitude = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation((prev) => ({
      ...prev,
      longitude: event.target.value
    }))
  }

  const handleImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageFile = await new Promise <ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({fileName: file.name, base64Data: reader.result as string});
          };
          reader.readAsDataURL(file);
        });
        setImage(imageFile);
      }
      catch(error) {
        console.error("Error reading the image file: ", error);
        setImage(undefined);
      }
    } 
    else {
      setImage(undefined);
    }
  }


  const handleSave = () => {
    if(title.length > 0 && content.length && timeCost && image){
      const course:Course = {
        title: title,
        timeCost: timeCost,
        location: location,
        content: content,
        image: image
      };
      console.log(course);
      onSave(course);
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <header className={styles.header}>
          <span className={styles.headerTitle}>코스 관리</span>
          <button className={styles.exitBtn} onClick={onToggle}>나가기</button>
        </header>
        <div className={styles.body}>
          <div className={`${styles.container} ${styles.title}`}>
            <p className={styles.label}>코스 제목</p>
            <input className={`${styles.input} ${styles.title}`} value={title} onChange={handleTitle} type="text" />
          </div>
          <div className={`${styles.container} ${styles.timeCost}`}>
            <p className={styles.label}>코스 소요시간</p>
            <input className={`${styles.input} ${styles.timeCost}`} value={timeCost} onChange={handleTimeCost} type="text" placeholder='코스 소요시간을 입력하세요.' />
          </div>
          <div className={`${styles.container} ${styles.location}`}>
            <div className={styles.latitude}>
              <p className={styles.label}>위도값</p>
              <input className={`${styles.input} ${styles.latitude}`} value={location.latitude} onChange={handleLatitude} type="text" placeholder='위도값을 입력하세요.' />
            </div>
            <div className={styles.longitude}>
              <p className={styles.label}>경도값</p>
              <input className={`${styles.input} ${styles.longitude}`} value={location.longitude} onChange={handleLongitude} type="text" placeholder='경도값을 입력하세요.' />
            </div>
          </div>
          <div className={`${styles.container} ${styles.content}`}>
            <p className={styles.label}>코스 설명</p>
            <textarea className={`${styles.input} ${styles.content}`} value={content} onChange={handleContent}></textarea>
          </div>
          <div className={`${styles.container} ${styles.img}`}>
            <span className={` ${styles.label} ${styles.img}`}>코스 이미지</span>
            <input className={styles.imgInput} id="imgInput" onChange={handleImg} accept="image/png, image/jpeg" type="file"/>
            {image && <img className={styles.currentImg} src={image.base64Data} alt="Course" />}
          </div>       
        </div>

        <button className={styles.saveBtn} onClick={handleSave}>추가</button>
      </div>
      <div className={styles.backDrop}></div>
    </>
  );
}

export default CourseModal;