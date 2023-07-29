import { useCallback, useEffect, useState, Fragment } from 'react';
import classes from "./editSupport.module.css";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Input } from '@mui/material';

interface Support {
    id: string;
    title: string,
    subTitle: string,
    description: string,
    imageUrl: string,

  }
  
  export default function AddPostSection({id, title, subTitle, description, imageUrl}: Support) {
    const [supports, setSupports] = useState<Support[]>([]);
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
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const timestamp = serverTimestamp();
    const [createdAt, setCreatedAt] = useState(Timestamp.now);
    const [newSection, setNewSection] = useState<Support>({
      id: "",
      title: "",
      subTitle: "",
      description: "",
      imageUrl: "",
    });
    const firestore = getFirestore();
  
    const fetchSupports = useCallback(async () => {
      const querySnapshot = await getDocs(collection(getFirestore(), "support-content"));
      const fetchedPosts: Support[] = [];
      querySnapshot.forEach((doc) => {
        const supportData = doc.data() as Support;
        supportData.id = doc.id;
        fetchedPosts.push(supportData);
        console.log(supportData);
      });
      setSupports(fetchedPosts);
    }, []);
  
    useEffect(() => {
      const timeOutId = setTimeout(async () => {
        fetchSupports();
      }, 100);
      return () => clearTimeout(timeOutId);
    }, [fetchSupports]);
  
    const savePost = async (support: Support) => {
      try {
        await updateDoc(doc(firestore, "support-content", support.id), {
          title: support.title,
          subTitle: support.subTitle,
          description: support.description,
          imageUrl: uploadedImage,
        });
        setEditSupport(null);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    };
  
    const handleSaveEdits = async (supportId: string) => {
      try {
        const support = supports.find((support) => support.id === supportId);
  
        if (support) {
          await updateDoc(doc(getFirestore(), 'support-content', supportId), {
            ...support
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
      console.log('adddd')
      if (newSection.title === '') {
        setModalMessage("An error occurred while creating the post.");
      } else {
        try {
          newSection.imageUrl=uploadedImage1;
          const docRef = await addDoc(collection(firestore, 'support-content'), newSection);
          setModalMessage("Post added.");
          setIsModalOpen(true);
          fetchSupports();
          console.log("add")
          setShowModal(true);         
          }
         catch (error) {
          setModalMessage("An error occurred while creating the post.");
          setIsModalOpen(true);
          console.log(error)
        }
      }
    }
    const handleDeleteSupport = async (supportId: string) => {
      console.log(supportId)
    const docRef = doc(getFirestore(), "support-content", supportId);
  
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
            setIsImageUploaded(true);
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
              {supports.map((support, index) => (
                <div key={support.id} className={classes.blogContainer}>
                  {editSupport === support.id ? (
                    <div className={classes.sentenceContainer}>
                      <div className={classes.editContainer}>
                        <TextField
                          label="Title"
                          value={support.title}
                          className={classes.editTitle}
                          size="small"
                          multiline
                          rows={1}
                          sx={{ width: "350px" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedSupport = { ...support, title: e.target.value };
                            setSupports((prevSupports) =>
                              prevSupports.map((prevSupport) =>
                                prevSupport.id === support.id ? updatedSupport : prevSupport
                              )
                            );
                          }}
                        />
                        <TextField
                          label="Sub-Title"
                          value={support.subTitle}
                          className={classes.editSubTitle}
                          size="small"
                          multiline
                          rows={2}
                          sx={{ width: "350px" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedSupport = { ...support, subTitle: e.target.value };
                            setSupports((prevSupports) =>
                              prevSupports.map((prevSupport) =>
                                prevSupport.id === support.id ? updatedSupport : prevSupport
                              )
                            );
                          }}
                        />
                        <TextField
                          label="Description"
                          value={support.description}
                          className={classes.editDescription}
                          size="small"
                          multiline
                          rows={5}
                          sx={{ width: "350px" }}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedSupport = { ...support, description: e.target.value };
                            setSupports((prevSupports) =>
                              prevSupports.map((prevSupport) =>
                                prevSupport.id === support.id ? updatedSupport : prevSupport
                              )
                            );
                          }}
                        />
                        <Input type="file" id="image" onChange={handleImageUpload}/>
                      <img src={support.imageUrl} className={classes.imageUrl}/>

                      </div>
                      <div className={classes.buttonContainer1}>
                        <button className={classes.saveButton} onClick={() => savePost(support)}>
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
                      <p className={classes.title1}>Title: {support.title}</p>
                      <p className={classes.subTitle}>Sub-Title: {support.subTitle}</p>
                      <p className={classes.description}>Decription: {support.description}</p>
                      <h4 className={classes.imageTitle}>Image:</h4>
                      <img src={support.imageUrl} className={classes.imageUrl}/>
                    </div>
                  )}
                  {editSupport === support.id ? (
                    null
                  ) : (
                    <div className={classes.buttonContainer2}>
                      <button
                        className={classes.editButton}
                        onClick={() => setEditSupport(support.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={classes.deleteButton}
                        onClick={() => handleDeleteSupport(support.id)}
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
                  <input
                    type="text"
                    placeholder="Sub-Title"
                    value={newSection.subTitle}
                    className={classes.modalInput}
                    onChange={(e) => setNewSection({ ...newSection, subTitle: e.target.value })}
                  />
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
                    <button className={classes.modalButton} onClick={() => { setShowModal(false); setNewSection({ id: "", title: "", subTitle: "", description: "", imageUrl: "" }) }}>Cancel</button>
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







