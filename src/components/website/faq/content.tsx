import classes from "./content.module.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, onSnapshot, } from "firebase/firestore";

interface FaqContent {
    question: string,
    answer: string,
}

export default function FaqList() {
    const [faq, setFaq] = useState<FaqContent[]>([]);
    
    const getFaq = async() =>{
      const querySnapshot = await getDocs(collection(getFirestore(), "faq"));
        const faq = [] as FaqContent[];
        querySnapshot.forEach((doc)=>{
          faq.push({question:doc.id,...doc.data(),answer:doc.data().answer} as FaqContent)
        })
        setFaq(faq);
    }
  
    useEffect(() => {
      setTimeout(()=>{
          getFaq();
      },100)
    }, []);

    /*useEffect(() => {
      const firestore = getFirestore();
      const unsubscribe = onSnapshot(collection(firestore, "faq"), (querySnapshot) => {
        const updatedFaq: FaqContent[] = [];
        querySnapshot.forEach((doc) => {
          const faqData = doc.data() as FaqContent;
          updatedFaq.push(faqData);
        });
        setFaq(updatedFaq);
      });
  
      // Cleanup the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }, []);*/
  
    return (
        <div className={classes.faqContentContainer}>
          {faq.map((item, index) => (
            <div key={index} className={classes.container}>
              <div className={classes.container1}>
                <div className={classes.questionContainer}>
              <h3 className={classes.question}>{item.question}</h3>
                </div>  
                <div className={classes.answerContainer}>
              <p className={classes.answer}>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    );
  }