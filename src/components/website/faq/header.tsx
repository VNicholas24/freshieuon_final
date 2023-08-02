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

    
    return (
      <div className={classes.background} style={{ backgroundImage: `url(${imageUrl})`}}>
          <h1 className={classes.title}>{title}</h1>
          <h2 className={classes.title2}>{title2}</h2>        
          <h3 className={classes.title3}>{title3}</h3>        
      </div>
    )
  }

  
  export default Header;