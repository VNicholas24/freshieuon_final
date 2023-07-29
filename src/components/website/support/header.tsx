import classes from './header.module.css';
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, } from "firebase/firestore";

interface HeaderProps {
    title : string,
    imageUrl : string,
}

    const Header: React.FC<HeaderProps> = ({ title,imageUrl}) => {

    
    return (
      <div className={classes.background} style={{ backgroundImage: `url(${imageUrl})`}}>
          <h1 className={classes.title}>{title}</h1>    
      </div>
    )
  }

  
  export default Header;