import classes from "./content.module.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, onSnapshot, } from "firebase/firestore";

interface SupportContent {
    title: string,
    subTitle: string,
    description: string,
    imageUrl: string,
}

export default function Content() {
    const [post, setPost] = useState<SupportContent[]>([]);
    
    const getPost = async() =>{
      const querySnapshot = await getDocs(collection(getFirestore(), "support-content"));
        const support = [] as SupportContent[];
        querySnapshot.forEach((doc)=>{
          console.log(doc.id)
          support.push({title:doc.id,...doc.data(),
            subTitle:doc.data().subTitle,
            description:doc.data().description,
            imageUrl:doc.data().imageUrl,
        } as SupportContent)
        })
        setPost(support);
        console.log(post)

    }
    useEffect(() => {
      setTimeout(()=>{
          getPost();
      },100)
    }, []);
  
    return (
        <div className={classes.supportContentContainer}>
          {post.map((item, index) => (
            <div key={index} className={classes.container}>
              <div className={classes.container1}>
                <div className={classes.postContainer}>
                  <div className={classes.imageContainer}>
                    <img src={item.imageUrl} className={classes.imageUrl}/>
                  </div>
                  <div className={classes.titleContainer}>
                    <h2 className={classes.title}>{item.title}</h2>
                    <h3 className={classes.subTitle}>{item.subTitle}</h3>
                    <p className={classes.description}>{item.description}</p>
                    </div>
                  </div>
                </div>                
            </div>
          ))}
        </div>
    );
  }