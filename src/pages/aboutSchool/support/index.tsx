import classes from "./index.module.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, QuerySnapshot } from "firebase/firestore";
import Header from "../../components/website/support/header";
import Content from "@/components/website/support/content";


interface SupportHeader {
  title : string,
  imageUrl : string,
}

export default function Support() {
    const [supportHeader1, setSupportHeader] = useState<SupportHeader>({title:"",imageUrl:"",});

    const getSupportHeader = async() =>{
    const querySnapshot = await getDocs(collection(getFirestore(), "support-header"));
    console.log(querySnapshot.docs);
    const supportHeader : SupportHeader = {
      title:querySnapshot.docs[0].data().title,
      imageUrl:querySnapshot.docs[0].data().imageUrl,
    }
    
    setSupportHeader(supportHeader)
    console.log(supportHeader)
  }

  useEffect(() => {
    setTimeout(()=>{
        getSupportHeader()
    },100)
  }, []);
  return (
    <div>
      <div className={classes.container}>
        <Header title={supportHeader1.title} imageUrl={supportHeader1.imageUrl}></Header>
      </div>
      <div className={classes.postContainer}>
        <Content></Content>
      </div>
    </div>   
  )
}

