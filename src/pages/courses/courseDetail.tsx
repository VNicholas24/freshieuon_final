import Link from "next/link";
import { Card, CardContent, Typography, Breadcrumbs } from "@mui/material";
import Header from "../../components/website/courses/header";
import { useEffect, useState, useCallback } from "react";
import { collection, getFirestore, getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

import classes from "./courseDetail.module.css";

interface CoursesDetailHeader {
  title: string;
  description: string;
  imageUrl: string;
}

interface Blog {
  id: string;
  blogTitle: string;
  compareImageUrl: string;
  description: string;
  text: string;
}

export default function CourseDetail() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const router = useRouter();
  console.log("router", router);
  const [coursesDetailHeader, setCoursesDetailHeader] =
    useState<CoursesDetailHeader>({
      title: "",
      description: "",
      imageUrl: require("../../images/courseDetail-bg.jpeg").default.src,
    });
  const [blog, setBlog] = useState<Blog | undefined>({
    id: "",
    blogTitle: "",
    compareImageUrl: "",
    description: "",
    text: "",
  });

  const fetchBlog = useCallback(async () => {
    const id = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    if (id) {
      const docCurRef = doc(getFirestore(), "courses-blog", id);
      const curDocSnap = await getDoc(docCurRef);
      const blogData = curDocSnap.data() as Blog;
      setBlog(blogData);
      const headerRef = doc(getFirestore(), "courses-blog-header", id);
      const curHeader = await getDoc(headerRef);
      const headerData = curHeader.data();
      if (headerData) {
        setCoursesDetailHeader({
          title: headerData.title,
          description: headerData.description,
          imageUrl: headerData.imageUrl,
        });
        setBackgroundImageUrl(headerData.imageUrl);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchBlog();
    }, 400);
  }, []);
  console.log("blog", blog);
  return (
    <div>
      <Header
        title={coursesDetailHeader.title}
        description={coursesDetailHeader.description}
        imageUrl={coursesDetailHeader.imageUrl}
        height="100vh"
      ></Header>
      <div className={classes.all}>
        <div className={classes.content}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/courses" className={classes.link}>
              Courses
            </Link>
            <Typography color="textPrimary" className={classes.link}>
              Detail
            </Typography>
          </Breadcrumbs>

          {blog && (
            <Card>
              <CardContent>
                <Typography
                  variant="h4"
                  component="h5"
                  className={classes.title}
                >
                  {blog.blogTitle}
                </Typography>
                <Typography className={classes.subtitle}>
                  {blog.description}
                </Typography>
                <div className={classes.cardcontent}>
                  <div
                    className={classes.text}
                    dangerouslySetInnerHTML={{ __html: blog.text }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
