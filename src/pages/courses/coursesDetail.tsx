import Link from "next/link";
import { Card, CardContent, Typography, Breadcrumbs } from "@mui/material";
import Header from "../../components/website/accommodation/header";

import { useEffect, useState, useCallback } from "react";
import { collection, getFirestore, getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

import classes from "./coursesDetail.module.css";

interface CoursesDetailHeader {
  title: string;
  description: string;
  imageUrl: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  text: string;
}

export default function CourseDetail() {
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
    title: "",
    description: "",
    text: "",
  });

  const fetchBlog = useCallback(async () => {
    const id = router.query.id;
    if (Array.isArray(id)) return;
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
    <div className={classes.all}>
      <div
        className={classes.container}
        style={{ backgroundImage: `url(${coursesDetailHeader.imageUrl})` }}
      >
        <p className={classes.headerDescription}>Courses {">"} Blog</p>
        <h1 className={classes.headerTitle}>{coursesDetailHeader.title}</h1>
      </div>
      <div className={"flex justify-center bg-[#ebe6de]"}>
        {blog && (
          <div
            className={"w-[700px] p-[50px] bg-[#faf7f2]"}
            dangerouslySetInnerHTML={{ __html: blog.text }}
          ></div>
        )}
      </div>
    </div>
  );
}
