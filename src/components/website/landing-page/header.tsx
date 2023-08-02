import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import classes from "./header.module.css";
import "firebase/firestore";
import { Button } from "@mui/material";
import { useRouter } from "next/router";


interface HeaderProps {
  title: string;
  imageUrl: string;
  description: string;
  subTitle: string;
}
interface Banner {
  imageUrl: string;
}

interface MidContent {
  id: string;
  imageUrl: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  imageUrl,
  description,
  subTitle,
}) => {
  const [landingPageHeader, setLandingPageHeader] = useState<HeaderProps>({
    title: "",
    imageUrl: "",
    description: "",
    subTitle: "",
  });
  const [banner, setBanner] = useState<Banner[]>([]);
  const [midContent, setMidContent] = useState<MidContent[]>([]);
  const router = useRouter();


  const getBanner = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "landing-page-banner")
    );
    const bannerData: Banner[] = [];
    querySnapshot.forEach((doc) => {
      bannerData.push({
        imageUrl: doc.data().imageUrl,
      });
    });
    setBanner(bannerData);
  };

  useEffect(() => {
    setTimeout(() => {
      getBanner();
    }, 100);
  }, []);

  const getMidContent = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "landing-page-mid-content")
    );
    const midContent = [] as MidContent[];
    querySnapshot.forEach((doc) => {
      midContent.push({
        id: doc.id,
        imageUrl: doc.data().imageUrl,
        description: doc.data().description,
      } as MidContent);
    });
    setMidContent(midContent);
  };

  useEffect(() => {
    setTimeout(() => {
      getMidContent();
    }, 100);
  }, []);

  const handleRedirect = () => {
    router.push("/preparation-guide"); 
  };

  return (
    <div
      className={classes.background}
      style={{
        backgroundImage: `url(${imageUrl})`,
        height: "5000px",
        width: "100%",
      }}
    >
      <h1 className={classes.title}>{title}</h1>
      <p className={classes.description}>{description}</p>
      <Button className={classes.buttonContainer} 
              variant="contained"
              onClick={() => {
                handleRedirect();
              }}>
        Learn More
      </Button>
      <h3 className={classes.subTitle}>{subTitle}</h3>
      <div>
        {banner.map((item, index) => (
          <div key={index} className={classes.banner}>
            <img src={item.imageUrl} className={classes.imageUrl} />
          </div>
        ))}
      </div>
      <div className={classes.midContentContainer}>
        {midContent.map((item, index) => (
          <div key={index} className={classes.container1}>
            <div className={classes.container2}>
              <div className={classes.postContainer}>
                <img
                  src={item.imageUrl}
                  className={classes.midContentImageUrl}
                />
                <p className={classes.midContentDescription}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
