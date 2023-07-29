import classes from './header.module.css';
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, } from "firebase/firestore";

interface HeaderProps {
    title : string,
    imageUrl : string,
    title2: string,
    title3: string,

}

    const Header: React.FC<HeaderProps> = ({ title,imageUrl,title2,title3, }) => {
      /*const [faqHeader, setFaqHeader] = useState<HeaderProps>({title:"",imageUrl:"",title2:"",title3:""});

      const getFaqHeader = async() =>{
      const querySnapshot = await getDocs(collection(getFirestore(), "faq-header"));
      console.log(querySnapshot.docs);
      const faqHeader : HeaderProps = {
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
    }, []);*/

    
    return (
      <div className={classes.background} style={{ backgroundImage: `url(${imageUrl})`}}>
          <h1 className={classes.title}>{title}</h1>
          <h2 className={classes.title2}>{title2}</h2>        
          <h3 className={classes.title3}>{title3}</h3>        
      </div>
    )
  }

  
  export default Header;