import { useCallback, useEffect, useState, Fragment } from 'react';
import classes from "./editSectionContent.module.css";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, onSnapshot,  } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Input } from '@mui/material';

interface MidContent {
    id: string;
    title: string;
    description: string,
    imageUrl: string,
  }
  
  export default function AddPostSection({id, title, description, imageUrl}: MidContent) {
    const [midContents, setMidContents] = useState<MidContent[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [errorstates, seterrorstates] = useState({
      sameslug: false, emptytext: false
    });
    const [editSupport, setEditSupport] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState(imageUrl);
    const [uploadedImage1, setUploadedImage1] = useState(imageUrl);
    const [imageError, setImageError] = useState("");
    const [imageError1, setImageError1] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const timestamp = serverTimestamp();
    const [createdAt, setCreatedAt] = useState(Timestamp.now);
    const [newSection, setNewSection] = useState<MidContent>({
      id: "",
      title:'',
      description: "",
      imageUrl: "",
    });
    const firestore = getFirestore();
  
    const fetchSupports = useCallback(async () => {
      const querySnapshot = await getDocs(collection(getFirestore(), "landing-page-section-content"));
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
  
    const savePost = async (midContent: MidContent) => {
      try {
        await updateDoc(doc(firestore, "landing-page-section-content", midContent.id), {
          description: midContent.description,
          imageUrl: uploadedImage,
        });
        setEditSupport(null);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    };
  
    const handleSaveEdits = async (midContentId: string) => {
      try {
        const midContent = midContents.find((midContent) => midContent.id === midContentId);
  
        if (midContent) {
          await updateDoc(doc(getFirestore(), 'landing-page-section-content', midContentId), {
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
      if (newSection.title === '') {
        setModalMessage("An error occurred while creating the post.");
      } else {
        try {
          newSection.imageUrl=uploadedImage1
          const docRef = await addDoc(collection(firestore, 'landing-page-section-content'), newSection);
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
      console.log(midContentId)
    const docRef = doc(getFirestore(), "landing-page-section-content", midContentId);
  
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
    return (
      <div>
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
                          label="Title"
                          value={midContent.title}
                          className={classes.editDescription}
                          size="small"
                          sx={{ width: "350px" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedSupport = { ...midContent, title: e.target.value };
                            setMidContents((prevSupports) =>
                              prevSupports.map((prevSupport) =>
                                prevSupport.id === midContent.id ? updatedSupport : prevSupport
                              )
                            );
                          }}
                        />
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
                      <p className={classes.postTitle}>Title: {midContent.title}</p>
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
                  <input
                type="text"
                placeholder="Title"
                value={newSection.title}
                className={classes.modalInput}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    rows={25}
                    value={newSection.description}
                    className={classes.modalDescriptionInput}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  />
                  <h4 className={classes.imageUrl}>Upload Image :</h4>
                        <Input type="file" id="image" onChange={handleImageUpload1}/>
                  <div className={classes.modalButtons}>
                    <button className={classes.modalButton} onClick={handleCreatePost}>Add</button>
                    <button className={classes.modalButton} onClick={() => { setShowModal(false); setNewSection({ id:'', title:'', description:'', imageUrl:''}) }}>Cancel</button>
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
      </div>
    );
  }







