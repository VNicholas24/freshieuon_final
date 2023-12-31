import Header from "@/components/website/landing-page/header";
import classes from "./index.module.css";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "firebase/firestore";
import Content from "@/components/website/landing-page/content";
import { useRouter } from "next/router";

interface LandingPageHeader {
  title: string;
  imageUrl: string;
  description: string;
  subTitle: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [landingPageHeader1, setLandingPageHeader] =
    useState<LandingPageHeader>({
      title: "",
      imageUrl: "",
      description: "",
      subTitle: "",
    });

  const getLandingPageHeader = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "landing-page-header")
    );
    console.log(querySnapshot.docs);
    const landingPageHeader: LandingPageHeader = {
      title: querySnapshot.docs[0].data().title,
      imageUrl: querySnapshot.docs[0].data().imageUrl,
      description: querySnapshot.docs[0].data().description,
      subTitle: querySnapshot.docs[0].data().subTitle,
    };
    console.log(landingPageHeader.imageUrl);

    setLandingPageHeader(landingPageHeader);
    console.log(landingPageHeader);
  };

  useEffect(() => {
    setTimeout(() => {
      getLandingPageHeader();
    }, 100);
  }, []);

  return (
    <div>
      <div className={classes.videoContainer}>
        <iframe
          src="https://www.youtube.com/embed/vboL8OeX9M8?version=3&autoplay=1&loop=1&playlist=vboL8OeX9M8&modestbranding=1&showinfo=0&controls=0&vq=hd720&rel=0&mute=1"
          title="YouTube video player"
          frameBorder="0"
          width={"100%"}
          className={classes.video}
          height={"900px"}
          allow="autoplay; loop; encrypted-media;muted"
          allowFullScreen
        ></iframe>
      </div>

      <div className={classes.container}>
        <Header
          title={landingPageHeader1.title}
          description={landingPageHeader1.description}
          imageUrl={landingPageHeader1.imageUrl}
          subTitle={landingPageHeader1.subTitle}
        ></Header>
      </div>
      <div className={classes.midContentContainer}>
        <Content></Content>
      </div>
    </div>
  );
}
