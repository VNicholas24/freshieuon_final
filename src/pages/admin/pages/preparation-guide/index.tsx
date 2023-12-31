import Header from "@/components/admin/header";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { CircularProgress, TextField } from "@mui/material";
import SideBar from "@/components/admin/sideBar/sideBar";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { Modal } from "@mui/material";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import DetailedPageSection from "@/components/admin/getting-around-sg/detailedPageSection";
import HeaderEdit from "@/components/admin/preparation-guide/headerEdit";
import SubPageSection from "@/components/admin/preparation-guide/subPageSection";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function PreparationGuide() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  let blogTitle = "preparation-guide";
  const [isLoading, setIsLoading] = useState(true);
  const [text, settext] = useState("");
  const [slug, setslug] = useState("");
  const [title, settitle] = useState("");
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerTitle2, setBannerTitle2] = useState("");
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [isPublishedGlobally, setisPublishedGlobally] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const fetchPage = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(getFirestore(), "preparation-guide-header")
    );
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      setslug((slug) => blogTitle);
      if (docSlug == blogTitle) {
        settitle((title) => doc.data().title);
        settext((text) => doc.data().text);
        setisPublishedGlobally(doc.data().isPublishedGlobally);
        setPostedBy(doc.data().postedBy);
        setCreatedAt(doc.data().createdAt);
        setBannerTitle(doc.data().title);
        setBannerTitle2(doc.data().title2);
        setBannerImageUrl(doc.data().imageUrl);
      }
    });
  }, [blogTitle]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchPage, blogTitle]);

  const postPage = async () => {};

  const postPagePreview = async () => {};

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `preparation-guide/${blogTitle}/`);

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), "preparation-guide-header", slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(
        getFirestore(),
        "preparation-guide-header",
        blogTitle
      );
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        // Delete the existing document if the slug is not the same
        console.log(slug, blogTitle);
        if (slug != blogTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, {
            title: bannerTitle,
            title2: bannerTitle2,
            imageUrl: imageUrl,
            slug: slug,
          });
        } else {
          await updateDoc(docRef, {
            title: bannerTitle,
            title2: bannerTitle2,
            imageUrl: imageUrl,
            isPublishedGlobally: isPublishedGlobally,
          });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, {
          title: bannerTitle,
          title2: bannerTitle2,
          imageUrl,
          slug: slug,
          isPublishedGlobally: isPublishedGlobally,
        });
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const postHeaderPreview = async () => {};

  const onTitleChange = (title: string) => {
    settitle(title);
  };

  const returnSection = (
    <div className={classes.upperSecContainer}>
      <h3 className={classes.sectionTitle}>Normal ToDos Detailed Page</h3>
      <SubPageSection></SubPageSection>
    </div>
  );

  return (
    <div>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress /> {/* Display the spinner */}
          <p>Loading...</p>
        </div>
      ) : title === "" ? (
        <p>Page not found</p>
      ) : (
        <div className={classes.container}>
          <Header id={blogTitle} blogTitle={blogTitle} urlArray={urlArray} category={""} />
          <div className={classes.flexContainer}>
            <div className={classes.bodyContainer}>
              <div className={classes.upperSecContainer}>
                <h3 className={classes.sectionTitle}>Title</h3>
                <TextField
                  InputProps={{ className: classes.input }}
                  sx={{ width: "600px" }}
                  size="small"
                  id="title"
                  variant="outlined"
                  onChange={(e) => onTitleChange(e.target.value)}
                  value={title}
                />
                <h3 className={classes.sectionTitle}>Slug</h3>
                <TextField
                  disabled
                  InputProps={{ className: classes.input }}
                  sx={{ width: "600px" }}
                  size="small"
                  id="slug"
                  variant="outlined"
                  value={slug}
                  onChange={(e) => {
                    setslug(e.target.value);
                    seterrorstates({ ...errorstates, sameslug: false });
                  }}
                  helperText={errorstates.sameslug ? "Slug already exists" : ""}
                />
                <h3 className={classes.sectionTitle}>Header</h3>
              </div>
              <HeaderEdit
                headerTitle={bannerTitle}
                headerTitle2={bannerTitle2}
                headerImageUrl={bannerImageUrl}
                setBannerTitle={setBannerTitle}
                setBannerImageUrl={setBannerImageUrl}
                setBannerTitle2={setBannerTitle2}
                setIsImageUploaded={setIsImageUploaded}
              />
              {returnSection}
              {/* Modal */}
              <Modal
                open={isModalOpen}
                onClose={closeModal}
                className={classes.modal}
              >
                <div className={classes.modalContainer}>
                  <h2>{modalMessage}</h2>
                  <Button variant="contained" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </Modal>
              {/* <Grid item xs={12} xl={6}>
                <ReactMarkdown className={classes.markdown}>{'# ' + title + '  \n' + text}</ReactMarkdown>
            </Grid> */}
            </div>
            <div className={classes.sideBar}>
              <SideBar
                postPage={postPage}
                postPagePreview={postPagePreview}
                postHeader={postHeader}
                postHeaderPreview={postHeaderPreview}
                isPublished={isPublishedGlobally}
                postedBy={postedBy}
                postedDate={createdAt}
                setIsPublished={setisPublishedGlobally}
              ></SideBar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
