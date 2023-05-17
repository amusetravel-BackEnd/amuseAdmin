import { useEffect, useState } from 'react';
import styles from './ProductForm.module.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import axiosInstance from '../../../services/axiosInstance';
import ExtraInfo from './ExtraInfo';
import MainInfo from './MainInfo';
import CourseInfo from './CourseInfo';
import TicketInfo from './TicketInfo';
import MainImage from './MainImage';

type HTML = string;

type Category = {
  name: string;
}

interface Ticket {
  title: string,
  content: string,
  priceList: Price[]
};

type Price = {
  startDate: string,
  endDate: string,
  weekdayPrices: {
    [key: string]: string
  }
}

interface Course {
  title: string;
  timeCost: string;
  content: string;
  image: ImageFile;
}

interface ImageFile {
  fileName: string,
  base64Data: string
}

type Product = {
  productId: string;
  category: string[];
  title: string;
  startPrice: number;
  admin: string;
  location: {
    country: string;
    city: string;
  };
  duration: string;
  startDate: string;
  endDate: string;
  mainImg: ImageFile[];
  ticket: Ticket[];
  mainInfo: string;
  course: Course[];
  extraInfo: HTML;
};


function ProductForm() {
  const [productId, setProductId] = useState<string>('');

  const handleProductID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(event.target.value);
  }

  const [category, setCategory] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  useEffect(
    () => {
      axios.get('/data/category.json')
        .then((res) => {
          setCategoryList(res.data);
        })
        .catch((err) => console.error(`failed to get categories: ${err}`));
    }, []
  );

  const handleProductCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory((prev) => [...prev, event.target.value]);
  }

  const renderCategoryOptions = () => {
    return categoryList.map((category) => {
      return (
        <option key={category} value={category}>
          {category}
        </option>
      );
    });
  };

  const [productTitle, setProductTitle] = useState<string>('');
  const handleProductName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductTitle(event.target.value);
  };

  const [country, setCountry] = useState<string>('');
  const handleCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value);
  };

  const [city, setCity] = useState<string>('');
  const handleCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const [listingStartDate, setListingStartDate] = useState<string>('');
  const handleListingStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListingStartDate(event.target.value);
  }

  const [listingEndDate, setListingEndDate] = useState<string>('');
  const handleListingEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListingEndDate(event.target.value);
  }

  const [durationNights, setDurationNights] = useState<string>('');
  const handleDurationNights = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDurationNights(event.target.value);
  }

  const [durationDays, setDurationDays] = useState<string>('');
  const handleDurationDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDurationDays(event.target.value);
  }

  const [mainImg, setMainImg] = useState <ImageFile[]>([]);
  const handleMainImg = (imageFiles: ImageFile[]) => {
    setMainImg((prev) => [...prev, ...imageFiles]);
  }
  
  const [ticket, setTicket] = useState<Ticket[]>([]);
  const handleTicket = (ticket:Ticket) => {
    setTicket((prev) => [...prev, ticket])
  }
  
  const [course, setCourse] = useState<Course[]>([]);
  const handleCourse = (course:Course) => {
    setCourse((prev) => [...prev, course])
  }

  const [mainInfo, setMainInfo] = useState<HTML>('');
  const handleMainInfo = (html:HTML) => {
    setMainInfo(html);
  }

  const [extraInfo, setExtraInfo] = useState<HTML>('');
  const handleExtraInfo = (html: HTML) => {
    setExtraInfo(html);
  }

  const handleAddProduct = () => {
      const product: Product = {
        productId,
        category,
        title: productTitle,
        startPrice: 9999,
        admin: 'daw916@naver.com',
        location: {
          country,
          city
        },
        duration:`${durationNights}박${durationDays}일`,
        startDate: listingStartDate,
        endDate: listingEndDate,
        mainImg,
        ticket,
        mainInfo,
        course,  
        extraInfo  
      };
      console.log(product);
    const jsonString = JSON.stringify(product);
    const byteSize = new Blob([jsonString], {type: 'application/json'}).size;
    console.log('byteSize: ', byteSize);
    axiosInstance.post('/test/api/product/create', product)
    .then((res) => {
      console.log(JSON.stringify(res));
      alert(`
        여행 상품 등록에 성공했습니다.
        ${JSON.stringify(res)}
      `)
    })
    .catch((err) => {
      console.error(err);
      alert(`
        여행 상품 등록에 실패했습니다.
        ${err}
      `)
    }    
    );
  }

  return (
    <div className={styles.productForm}>
        <div className={`${styles.container} ${styles.idAndCategory}`}>
          <div className={styles.category}>
            <span className={styles.title}>여행 카테고리</span>
            <select className={styles.categorySelect} onChange={handleProductCategory}>
              <option value="">카테고리 선택</option>
              {renderCategoryOptions()}
            </select>
            <div className={styles.categoryStatus}>
              {category.map(categoryName => 
                <li key={categoryName}>{categoryName}</li>
              )}
            </div>
          </div>
          <div className={styles.code}>
              <span className={styles.title}>상품 코드</span>
              <input className={styles.productId} type="text" onChange={handleProductID}/>
          </div>
        </div>

        <div className={`${styles.container} ${styles.name}`}>
            <span className={` ${styles.title} ${styles.name}`}>여행 상품명</span>
            <input className={`${styles.nameInput}`} value={productTitle} onChange={handleProductName} type="text"/>
        </div>

        <div className={`${styles.container} ${styles.locationAndDuration}`}>
            <div className={styles.country}>
              <span className={styles.title}>국가</span>
              <input value={country} onChange={handleCountry} type="text"/>
            </div>
            <div className={styles.city}>
              <span className={styles.title}>도시</span>
              <input value={city} onChange={handleCity} type="text"/>
            </div>
            <div className={styles.productPeriod}>
              <span className={styles.title}>상품 게재 기간</span>
              <input value={listingStartDate} onChange={handleListingStartDate} type="date"/>
              <span> ~ </span>
              <input value={listingEndDate} onChange={handleListingEndDate} type="date"/>
            </div>
            <div className={styles.duration}>
              <span className={styles.title}>여행 기간</span>
              <input className={styles.duration_input} value={durationNights} onChange={handleDurationNights} type="text" placeholder=''/>
              <span className={styles.title}>박</span>
              <input className={styles.duration_input} value={durationDays} onChange={handleDurationDays} type="text" placeholder=''/>
              <span className={styles.title}>일</span>
            </div>
        </div>

        <MainImage onAdd={handleMainImg}/>

        <TicketInfo onAdd={handleTicket} />

        <MainInfo onChange={handleMainInfo}/>

        <CourseInfo onAdd={handleCourse} />

        <ExtraInfo onChange={handleExtraInfo} />

        <div className={`${styles.container} ${styles.submit}`}>
            <button className={styles.submitBtn} onClick={handleAddProduct}>상품 등록하기</button>
        </div>
    </div>
  );
}

export default ProductForm;