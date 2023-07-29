import { useCallback, useEffect, useState, Fragment } from 'react';
import classes from "./editLPMidContent.module.css";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, onSnapshot, } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Input } from '@mui/material';
import YouTube from 'react-youtube';
import { getStorage, getDownloadURL, UploadTaskSnapshot, ref as storageRef, uploadBytesResumable, ref, uploadBytes, uploadString } from "firebase/storage"; // Add this import


interface MidContent {
    id: string;
    description: string,
    imageUrl: string,
  }
interface Video {
  id: string,
  videoUrl: string
}
interface Banner {
  id: string,
  imageUrl: string
}
  export default function AddPostSection({id, description, imageUrl}: MidContent,) {
    const [midContents, setMidContents] = useState<MidContent[]>([]);
    const [video, setVideo] = useState<Video[]>([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [banner, setBanner] = useState<Banner[]>([]);
    const [youtubeId, setYoutubeId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorstates, seterrorstates] = useState({
      sameslug: false, emptytext: false
    });
    const [editSupport, setEditSupport] = useState<string | null>(null)
    const [editVideo, setEditVideo] = useState<string | null>(null);
    const [editBanner, setEditBanner] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState(imageUrl);
    const [uploadedImage1, setUploadedImage1] = useState(imageUrl);
    const [uploadedImage2, setUploadedImage2] = useState(imageUrl);
    const [imageError, setImageError] = useState("");
    const [imageError1, setImageError1] = useState("");
    const [imageError2, setImageError2] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const timestamp = serverTimestamp();
    const [createdAt, setCreatedAt] = useState(Timestamp.now);
    const [newSection, setNewSection] = useState<MidContent>({
      id: "",
      description: "",
      imageUrl: "",
    });
    const firestore = getFirestore();
  
    const fetchSupports = useCallback(async () => {
      const querySnapshot = await getDocs(collection(getFirestore(), "landing-page-mid-content"));
      const fetchedPosts: MidContent[] = [];
      querySnapshot.forEach((doc) => {
        const supportData = doc.data() as MidContent;
        supportData.id = doc.id;
        fetchedPosts.push(supportData);
        console.log(supportData);
      });
      setMidContents(fetchedPosts);
    }, []);
  
    useEffect(() => {
      const timeOutId = setTimeout(async () => {
        fetchSupports();
      }, 100);
      return () => clearTimeout(timeOutId);
    }, [fetchSupports]);

    const fetchVideo = async () => {
      try {
        const querySnapshot = await getDocs(collection(getFirestore(), "landing-page-video"));
        const videoData: Video[] = [];
        querySnapshot.forEach((doc) => {
          videoData.push({
            videoUrl: doc.data().videoUrl,
            id: doc.data().id,
          });
        });
        setVideo(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
  
    useEffect(() => {
      fetchVideo();
    }, []);

    const fetchBanner = async () => {
      try {
        const querySnapshot = await getDocs(collection(getFirestore(), "landing-page-banner"));
        const bannerData: Banner[] = [];
        querySnapshot.forEach((doc) => {
          bannerData.push({
            id: doc.data().id,
            imageUrl: doc.data().imageUrl,
          });
        });
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
  
    useEffect(() => {
      fetchBanner();
    }, []);
  
    const savePost = async (midContent: MidContent) => {
      try {
        await updateDoc(doc(firestore, "landing-page-mid-content", midContent.id), {
          description: midContent.description,
          imageUrl: uploadedImage,
        });
        setEditSupport(null);
        fetchSupports;
      } catch (error) {
        console.error("Error updating post:", error);
      }
    };

  
  
    const handleSaveEdits = async (midContentId: string) => {
      try {
        const midContent = midContents.find((midContent) => midContent.id === midContentId);
  
        if (midContent) {
          await updateDoc(doc(getFirestore(), 'support-content', midContentId), {
            ...midContent
          });
          setEditSupport(null);
        }
      } catch (error) {
        console.error('An error occurred while saving edits:', error);
      }
    };
  
    const cancelEditFaq = () => {
      setEditSupport(null);
    };
  
    function isFirebaseStorageError(error: any): error is FirebaseStorageError {
      return error && error.code && typeof error.code === "string";
    }
  
    interface FirebaseStorageError {
      code: string;
      message: string;
      name: string;
    }
  
    const handleAddPost = () => {
      setShowModal(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setModalMessage("");
    };
  
    const handleCreatePost = async () => {
      if (newSection.description === '') {
        setModalMessage("An error occurred while creating the post.");
      } else {
        try {
          newSection.imageUrl=uploadedImage1;
          const docRef = await addDoc(collection(firestore, 'landing-page-mid-content'), newSection);
          setModalMessage("Post added.");
          setIsModalOpen(true);
          fetchSupports();
          setShowModal(true);         
          }
         catch (error) {
          setModalMessage("An error occurred while creating the post.");
          setIsModalOpen(true);
        }
      }
    }
    const handleDeleteSupport = async (midContentId: string) => {
    const docRef = doc(getFirestore(), "landing-page-mid-content", midContentId);
  
    try {
      await deleteDoc(docRef).then(()=>{fetchSupports()});
      setModalMessage("Post successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the faq.");
      setIsModalOpen(true);
    }
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedImage(imageUrl);
            setImageError(""); 
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageError("Invalid file type. Please upload an image.");
      }
    }
  };
  const handleImageUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedImage1(imageUrl);
            setImageError1(""); 
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageError1("Invalid file type. Please upload an image.");
      }
    }
  };

  const handleImageUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result.toString();
            setUploadedImage2(imageUrl);
            setImageError2(""); 
          }
        };
        reader.readAsDataURL(file);
      } else {
        setImageError2("Invalid file type. Please upload an image.");
      }
    }
  };

  /*const handleDeleteBanner = async () => {
    const docRef = doc(getFirestore(), "landing-page-banner", 'banner');
  
    try {
      await deleteDoc(docRef).then(()=>{fetchBanner()});
      setModalMessage("Image successfully deleted.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the video.");
      setIsModalOpen(true);
    }
  };*/

  const handleDeleteVideo = async () => {
  const docRef = doc(getFirestore(), "landing-page-video", 'video');

  try {
    await deleteDoc(docRef).then(()=>{fetchVideo()});
    setModalMessage("Video successfully deleted.");
    setIsModalOpen(true);
  } catch (error) {
    setModalMessage("An error occurred while deleting the video.");
    setIsModalOpen(true);
  }
};


const saveVideo = async (video1: Video) => {
  try {
    const firestore = getFirestore();

    await updateDoc(doc(firestore, "landing-page-video", "video"), {
      videoUrl: video1.videoUrl,
    });
    setModalMessage("Video successfully updated.");
    setIsModalOpen(true);

    setEditVideo(null); 

    fetchVideo();
  } catch (error) {
    setModalMessage("An error occurred while updating the video.");
    setIsModalOpen(true);
    console.error("Error updating video:", error);
  }
};

const saveBanner = async () => {
  const storage = getStorage();
  const storageRef = ref(storage, "landing-page/landing-page-banner-image/");

  try {
    // Upload the image to Firebase Storage and get the download URL
    await uploadString(storageRef, uploadedImage2, "data_url");
    const imageUrl = await getDownloadURL(storageRef);

    // Update the Firestore document with the new image URL reference
    await updateDoc(doc(firestore, "landing-page-banner", "banner"), {
      imageUrl: imageUrl,
    });

    // Optionally, you can do something with the 'imageUrl' or perform additional tasks

    setEditBanner(null); 
    fetchBanner(); 
  } catch (error) {
    console.error("Error updating banner:", error);
  }
};
  
  
    return (
      <div>
        <div className={classes.container}>
        <div className={classes.innerContainer}>
        <h3 className={classes.videoTitle}>Banner</h3>
        <div className={classes.imageInputContainer}> 
        <Input type="file" id="image" className={classes.imageInput} onChange={handleImageUpload2}/>
        </div>
  {banner.map((item, index) => (
    <div key={index} className={classes.bannerContainer}>
      <img src={item.imageUrl} className={classes.bannerImageUrl}/>
      <div className={classes.buttonContainer2}>
        </div>
      </div>
  ))}
    <div className={classes.buttonContainer3}>
      <button
  style={{ width: "100%"}} className={classes.videoButton}
  onClick={() => saveBanner()}
  >
          Save
        </button>
        </div>
  </div>
</div>  
        <div className={classes.container}>
          <div className={classes.innerContainer}>
            <div className={classes.titleContainer}>
              <h3 className={classes.title} style={{ marginRight: '150px' }}>No.</h3>
              <h3 className={classes.title} style={{ marginLeft: '70px' }}>Post</h3>
            </div>
            <div>
              {midContents.map((midContent, index) => (
                <div key={midContent.id} className={classes.blogContainer}>
                  {editSupport === midContent.id ? (
                    <div className={classes.sentenceContainer}>
                      <div className={classes.editContainer}>
                        <TextField
                          label="Description"
                          value={midContent.description}
                          className={classes.editDescription}
                          size="small"
                          multiline
                          rows={5}
                          sx={{ width: "350px" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedSupport = { ...midContent, description: e.target.value };
                            setMidContents((prevSupports) =>
                              prevSupports.map((prevSupport) =>
                                prevSupport.id === midContent.id ? updatedSupport : prevSupport
                              )
                            );
                          }}
                        />
                        <Input type="file" id="image" onChange={handleImageUpload}/>
                        <img src={midContent.imageUrl} className={classes.imageUrl}/>
                      </div>
                      <div className={classes.buttonContainer1}>
                        <button className={classes.saveButton} onClick={() => savePost(midContent)}>
                          Save
                        </button>
                        <button className={classes.cancelButton} onClick={cancelEditFaq}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={classes.smallContainer}>
                      <p className={classes.text}>{index + 1}.</p>
                      <p className={classes.description}>Decription: {midContent.description}</p>
                      <h4 className={classes.imageTitle}>Image:</h4>
                      <img src={midContent.imageUrl} className={classes.imageUrl}/>
                    </div>
                  )}
                  {editSupport === midContent.id ? (
                    null
                  ) : (
                    <div className={classes.buttonContainer2}>
                      <button
                        className={classes.editButton}
                        onClick={() => setEditSupport(midContent.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={classes.deleteButton}
                        onClick={() => handleDeleteSupport(midContent.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            <button style={{ width: "100%", zIndex: "3" }} className={classes.button} onClick={handleAddPost}>
              Add Post
            </button>
            {showModal && (
              <div className={classes.modal}>
                <div className={classes.modalContainer}>
                  <h2>Add Post</h2>
                  <textarea
                    placeholder="Description"
                    rows={25}
                    value={newSection.description}
                    className={classes.modalDescriptionInput}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  />
                        <Input type="file" id="image" onChange={handleImageUpload1}/>
                  <div className={classes.modalButtons}>
                    <button className={classes.modalButton} onClick={handleCreatePost}>Add</button>
                    <button className={classes.modalButton} onClick={() => { setShowModal(false); setNewSection({ id:'', description:'', imageUrl:''}) }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
  
            <Modal open={isModalOpen} onClose={closeModal} className={classes.modal}>
              <div className={classes.modalContainer}>
                <h2>{modalMessage}</h2>
                <Button variant="contained" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </Modal>
          </div>
        </div>
        <div className={classes.container}>
        <div className={classes.innerContainer}>
        <h3 className={classes.videoTitle}>Video</h3>
        <div>
      {video[0] ? (
        <div className={classes.videoContainer}>
          <YouTube videoId={video[0].videoUrl} opts={{ width: "500px", height: "300px" }} />
          <div className={classes.videoLinkContainer}>
          <h4 className={classes.videoInputTitle}>Youtube Link:</h4>
          <TextField
            className={classes.videoInput}
             style={{ zIndex: 2 }}
            value={video[0].videoUrl}
            size="small"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // Update the video URL when the TextField value changes
              const updatedVideoUrl = e.target.value;
              // Assuming 'setVideo' is the state update function to update the video URL
              setVideo((prevVideos) =>
                prevVideos.map((prevVideo, idx) =>
                  idx === 0 ? { ...prevVideo, videoUrl: updatedVideoUrl } : prevVideo
                )
              );
            }}
          />
          </div>
        </div>
      ) : null}
    </div> 
    <div className={classes.buttonContainer3}>
      <button
  style={{ width: "100%"}} className={classes.videoButton}
  onClick={() => saveVideo(video[0])}
  >
          Save
        </button>
        </div>
  </div>     
  </div>
</div>
    );
  }





