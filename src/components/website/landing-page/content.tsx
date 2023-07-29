import classes from "./content.module.css";
import "firebase/firestore";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "@mui/material";
import YouTube from "react-youtube";
import { useRouter } from "next/router";

interface SectionContent {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  url: string;
}
interface Video {
  videoUrl: string;
}

export default function Content() {
  const [sectionContent, setSectionContent] = useState<SectionContent[]>([]);
  const [video, setVideo] = useState<Video[]>([]);
  const router = useRouter();

  const getSectionContent = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "landing-page-section-content")
    );
    const sectionContent = [] as SectionContent[];
    let urlLink: string;
    querySnapshot.forEach((doc) => {
      if (doc.data().title == "Student Clubs") {
        urlLink = "/studentclub";
      } else if (doc.data().title == "Student Stories") {
        urlLink = "/studentstories";
      } else if (doc.data().title == "Accommodation") {
        urlLink = "/accommodation";
      } else if (doc.data().title == "Preparation Guide") {
        urlLink = "/preparation-guide";
      } else if (doc.data().title == "Exploring Singapore") {
        urlLink = "/getting-around-sg";
      }
      sectionContent.push({
        id: doc.id,
        title: doc.data().title,
        imageUrl: doc.data().imageUrl,
        description: doc.data().description,
        url: urlLink,
      } as SectionContent);
    });
    setSectionContent(sectionContent);
  };

  useEffect(() => {
    setTimeout(() => {
      getSectionContent();
    }, 100);
  }, []);

  const getVideo = async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "landing-page-video")
    );
    const videoData: Video[] = [];
    querySnapshot.forEach((doc) => {
      videoData.push({
        videoUrl: doc.data().videoUrl,
      });
    });
    setVideo(videoData);
  };

  useEffect(() => {
    setTimeout(() => {
      getVideo();
    }, 100);
  }, []);

  const handleRedirect = (itemUrl: string) => {
    // Perform the redirect to a specific URL
    router.push(itemUrl); // Replace 'destination-url' with the path you want to redirect to
  };

  return (
    <div className={classes.container}>
      <div className={classes.contentContainer}>
        {video.map((item, index) => (
          <div key={index} className={classes.videoContainer}>
            <YouTube
              videoId={item.videoUrl}
              className={classes.video}
              opts={{ width: "100%", height: "700px" }}
            />
          </div>
        ))}
        <div className={classes.sectionContainer}>
          {sectionContent.map((item, index) => (
            <div key={index} className={classes.sectionContainer1}>
              <div
                className={`${classes.sectionPostContainer} ${
                  index % 2 === 0 ? classes.leftPost : classes.rightPost
                }`}
              >
                <h4 className={classes.title1}>{item.title}</h4>
                <p className={classes.description1}>{item.description}</p>
                <img src={item.imageUrl} className={classes.imageUrl1} />
                <Button
                  className={classes.button1}
                  variant="contained"
                  onClick={() => {
                    handleRedirect(item.url);
                  }}
                >
                  Explore More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*<Button className={classes.button1} variant="contained">
                    Explore More
                  </Button>*/
