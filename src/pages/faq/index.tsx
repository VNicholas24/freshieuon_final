import classes from "./index.module.css";
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from '../../components/website/faq/searchBar';
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, QuerySnapshot } from "firebase/firestore";
import Header from "../../components/website/faq/header";
import Content from "../../components/website/faq/content";

interface FaqHeader {
  title : string,
  imageUrl : string,
  title2: string,
  title3: string,

}

export default function Faq() {
    const [faqHeader1, setFaqHeader] = useState<FaqHeader>({title:"",imageUrl:"",title2:"",title3:""});

    const getFaqHeader = async() =>{
    const querySnapshot = await getDocs(collection(getFirestore(), "faq-header"));
    console.log(querySnapshot.docs);
    const faqHeader : FaqHeader = {
      title:querySnapshot.docs[0].data().title,
      imageUrl:querySnapshot.docs[0].data().imageUrl,
      title2:querySnapshot.docs[0].data().title2,
      title3:querySnapshot.docs[0].data().title3,
    }
    
    setFaqHeader(faqHeader)
    console.log(faqHeader)
  }

  useEffect(() => {
    setTimeout(()=>{
        getFaqHeader()
    },100)
  }, []);
  return (
    <div>
      <div className={classes.container}>
        <Header title={faqHeader1.title} imageUrl={faqHeader1.imageUrl} title2={faqHeader1.title2} title3={faqHeader1.title3}></Header>
        <div className={classes.searchBarcontainer}>
          <SearchBar></SearchBar>
        </div>
        <div className={classes.contentcontainer}>
          <Content></Content>
        </div>
      </div>
    </div>   
  )
}

