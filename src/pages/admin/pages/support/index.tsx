import Header from "@/components/admin/header";
import classes from "./index.module.css";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
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
import HeaderEdit from "@/components/admin/pagesContent/hearderEdit";
import { Modal } from "@mui/material";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import EditSupport from "@/components/website/support/editSupport";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Support {
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
}

export default function DetailPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const urlArray: string[] = currentUrl.split("/");
  const supportTitle: string = "support ";
  const [isLoading, setIsLoading] = useState(true);
  const [text, settext] = useState("");
  const [slug, setslug] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [id, setId] = useState("");
  const timestamp = serverTimestamp();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");
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
    const querySnapshot = await getDocs(collection(getFirestore(), "support"));
    querySnapshot.forEach((doc) => {
      let docSlug = doc.id;
      setslug((slug) => supportTitle);
      console.log(docSlug, supportTitle);
      setTitle((title) => doc.data().title);
      settext((text) => doc.data().text);
      setisPublishedGlobally(doc.data().isPublishedGlobally);
      setPostedBy(doc.data().postedBy);
      setCreatedAt(doc.data().createdAt);
      console.log(doc.data());
    });
    const docs = await getDocs(collection(getFirestore(), "support-header"));
    docs.forEach((doc) => {
      setBannerTitle(doc.data().title);
      setBannerImageUrl(doc.data().imageUrl);
      setBannerDescription(doc.data().description);
    });
  }, [supportTitle]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchPage]);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      setIsLoading(true);
      fetchPage().then(() => setIsLoading(false));
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [supportTitle]);

  const postPage = async () => {
    if (text === "") {
      seterrorstates({ ...errorstates, emptytext: true });
    } else {
      const docRef = doc(getFirestore(), "support-header", slug);
      const docCurRef = doc(getFirestore(), "support-header", supportTitle);
      const docSnap = await getDoc(docRef);
      const docCurSnap = await getDoc(docCurRef);
      try {
        if (docCurSnap.exists()) {
          if (slug != supportTitle) {
            await deleteDoc(docCurRef).then(() =>
              setModalMessage("Page successfully deleted.")
            );
            await setDoc(docRef, {
              slug: slug,
              title: title,
              text: text,
              createdAt: timestamp,
              postedBy: "Admin",
              isPublishedGlobally: isPublishedGlobally,
            }).then(() => {
              router.replace(`/admin/pages/accommodation/blogTitle?=${slug}`);
            });
            setModalMessage("Page successfully updated.");
          } else {
            console.log(text);
            await updateDoc(docRef, {
              title: title,
              text: text,
              isPublishedGlobally: isPublishedGlobally,
            });
            setModalMessage("Page successfully updated.");
          }
        } else {
          await setDoc(docRef, {
            title: title,
            text: text,
            createdAt: timestamp,
            postedBy: "Admin",
          });
          setModalMessage("Page successfully added.");
        }
        setIsModalOpen(true);
      } catch (error) {
        setModalMessage("An error occurred while saving the page.");
        setIsModalOpen(true);
      }
    }
  };

  const postHeader = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `support/support-${slug}-header/`);

    try {
      if (isImageUploaded) {
        await uploadString(storageRef, bannerImageUrl, "data_url");
      }
      const imageUrl = isImageUploaded
        ? await getDownloadURL(storageRef)
        : bannerImageUrl;
      const docRef = doc(getFirestore(), "support-header", slug);
      const docSnap = await getDoc(docRef);
      const curDocRef = doc(getFirestore(), "support-header", supportTitle);
      const curDocSnap = await getDoc(curDocRef);
      if (curDocSnap.exists()) {
        // Delete the existing document if the slug is not the same
        console.log(slug, supportTitle);
        if (slug != supportTitle) {
          await deleteDoc(curDocRef).then(() =>
            setModalMessage("Header successfully deleted.")
          );
          await setDoc(docRef, { title: bannerTitle, imageUrl, slug: slug });
        } else {
          await updateDoc(docRef, { title: bannerTitle, imageUrl });
        }
        setModalMessage("Page successfully updated.");
      } else {
        await setDoc(docRef, { title: bannerTitle, imageUrl, slug: slug });
        setModalMessage("Page successfully added.");
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while saving the page.");
      setIsModalOpen(true);
    }
  };

  const onTitleChange = (title: string) => {
    setTitle(title);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : supportTitle == "" ? (
        <p>Page not found</p>
      ) : (
        <div className={classes.container}>
          <Header urlArray={urlArray} />
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
                headerDescription={bannerDescription}
                headerImageUrl={bannerImageUrl}
                setBannerTitle={setBannerTitle}
                setBannerImageUrl={setBannerImageUrl}
                setBannerDescription={setBannerDescription}
                setIsImageUploaded={setIsImageUploaded}
              />
              <div style={{ color: "red" }}>
                {errorstates.emptytext ? "Please enter text" : ""}
              </div>
              <EditSupport
                id={id}
                title={title}
                subTitle={subTitle}
                description={description}
                imageUrl={imageUrl}
              ></EditSupport>
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
                postHeader={postHeader}
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
//add component back on line 188
