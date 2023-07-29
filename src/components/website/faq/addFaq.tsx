import { useCallback, useEffect, useState, Fragment } from 'react';
import classes from "./addFaq.module.css";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField } from '@mui/material';

interface Faq {
  id: string;
  question: string;
  answer: string;
}


export default function AddFaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorstates, seterrorstates] = useState({
      sameslug: false, emptytext: false
  });
  const [editFaq, setEditFaq] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timestamp = serverTimestamp(); 
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [newSection, setNewSection] = useState<Faq>({
    id: "",
    question: "",
    answer: "",
  });
  const firestore = getFirestore()

  const fetchFaqs = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "faq")); //querySnapshot
    const fetchedFaqs: Faq[] = [];
    querySnapshot.forEach((doc) => {
      const faqData = doc.data() as Faq;
      faqData.id = doc.id;
      fetchedFaqs.push(faqData);
      console.log(faqData);
    });
    setFaqs(fetchedFaqs);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchFaqs();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchFaqs]);
  
  
  /*const saveFaq = async (faq: Faq) => {
    try {
      const { id, ...faqData } = faq;
      await updateDoc(doc(firestore, 'faq', id), faqData);
      setEditFaq(null);
    } catch (error) {
      // Handle the error
      console.error('Error updating FAQ:', error);
    }
  };*/

  const saveFaq = async (faq: Faq) => {
    try {
      await updateDoc(doc(firestore, "faq", faq.id), {
        question: faq.question,
        answer: faq.answer
      });
      setEditFaq(null);
    } catch (error) {
      console.error("Error updating faq:", error);
    }
  };

  const handleSaveEdits = async (faqId: string) => {
    try {
      const faq = faqs.find((faq) => faq.id === faqId);
      
      if (faq) {
        await updateDoc(doc(getFirestore(), 'faq', faqId), {
          ...faq
        });
        setEditFaq(null);
      }
    } catch (error) {
      console.error('An error occurred while saving edits:', error);
    }
  };

  const cancelEditFaq = () => {
    setEditFaq(null);
  };
//Real-time update
  /*useEffect(() => {
    const firestore = getFirestore();
    const unsubscribe = onSnapshot(collection(firestore, 'faq'), (querySnapshot) => {
      const updatedFaqs: Faq[] = [];
      querySnapshot.forEach((doc) => {
        const faqData = doc.data() as Faq;
        faqData.id = doc.id;
        updatedFaqs.push(faqData);
      });
      setFaqs(updatedFaqs);
    });
    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);*/

  // Type guard to check if the error is of type FirebaseStorageError
  function isFirebaseStorageError(error: any): error is FirebaseStorageError {
    return error && error.code && typeof error.code === "string";
  }

  // Custom type for Firebase storage errors
  interface FirebaseStorageError {
    code: string;
    message: string;
    name: string;
  }

  const handleAddFaq = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };
  //const generateUniqueID = () => {
    //const uniqueID = uuidv4();
    //return uniqueID;
  //};

  const handleCreateFaq = async () => {
  if (newSection.question === '') {
    seterrorstates({ ...errorstates });
  } else if (newSection.answer === '') {
    seterrorstates({ ...errorstates});
  } else {
    //const id = generateUniqueID;
    //console.log(id)
    try {
      const docRef = await addDoc(collection(firestore, 'faq'), newSection);
      setModalMessage("FAQ added.");
      setIsModalOpen(true);
      fetchFaqs()
      setShowModal(false)
    } 
      catch (error) {
      setModalMessage("An error occurred while creating the faq.");
      setIsModalOpen(true);
    }
  }
};

const handleDeleteFaq = async (faqId: string) => {
    console.log(faqId)
  const docRef = doc(getFirestore(), "faq", faqId);

  try {
    await deleteDoc(docRef).then(()=>{fetchFaqs()});
    setModalMessage("FAQ successfully deleted.");
    setIsModalOpen(true);
  } catch (error) {
    setModalMessage("An error occurred while deleting the faq.");
    setIsModalOpen(true);
  }
};

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.titleContainer}>
            <h3 className={classes.title} style={{ marginRight: '150px' }}>No.</h3>
            <h3 className={classes.title} style={{ marginLeft: '30px' }}>Question/Answer</h3>
          </div>
          <div>
  {faqs.map((faq, index) => (
    <div key={faq.id} className={classes.blogContainer}>
      {editFaq === faq.id ? (
        <div className={classes.sentenceContainer}>
          <div>
            <TextField
              label="Question"
              value={faq.question}
              size="small"
              multiline
              rows={2}
              sx={{ width: "280px" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const updatedFaq = { ...faq, question: e.target.value };
                setFaqs((prevFaqs) =>
                  prevFaqs.map((prevFaq) =>
                    prevFaq.id === faq.id ? updatedFaq : prevFaq
                  )
                );
              }}
            />
            <TextField
              label="Answer"
              value={faq.answer}
              size="small"
              multiline
              rows={4}
              sx={{ width: "280px" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const updatedFaq = { ...faq, answer: e.target.value };
                setFaqs((prevFaqs) =>
                  prevFaqs.map((prevFaq) =>
                    prevFaq.id === faq.id ? updatedFaq : prevFaq
                  )
                );
              }}
            />
          </div>
          <div className={classes.buttonContainer1}>
            <button className={classes.saveButton} onClick={() => saveFaq(faq)}>
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
          <p className={classes.question}>{faq.question}</p>
          <p className={classes.answer}>{faq.answer}</p>
        </div>
      )}
      {editFaq === faq.id ? (
        null // Empty space, no edit/delete buttons
      ) : (
        <div className={classes.buttonContainer2}>
          <button
            className={classes.editButton}
            onClick={() => setEditFaq(faq.id)}
          >
            Edit
          </button>
          <button
            className={classes.deleteButton}
            onClick={() => handleDeleteFaq(faq.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>

          <button style={{ width: "100%",zIndex:"3" }} className={classes.button} onClick={handleAddFaq}>
            Add FAQ
          </button>
          {showModal && (
        <div className={classes.modal}>
          <div className={classes.modalContainer}>
            <h2>Add FAQ</h2>
              {/* Add the modal content to prompt the admin to add the title and slug */}
              <input
                type="text"
                placeholder="Question"
                value={newSection.question}
                className={classes.modalInput}
                onChange={(e) => setNewSection({ ...newSection, question: e.target.value })}
              />
              <input
                type="text"
                placeholder="Answer"
                value={newSection.answer}
                className={classes.modalInput}
                onChange={(e) => setNewSection({ ...newSection, answer: e.target.value })}
              />
              <div className={classes.modalButtons}>
                <button className={classes.modalButton} onClick={() => handleCreateFaq()}>Add</button>
                <button className={classes.modalButton} onClick={() => {setShowModal(false);setNewSection({
          id: "",
          question: "",
          answer: "",})}}>Cancel</button>  
             </div>
          </div>
        </div>
          )}
          
          
          {/* Modal */}
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








/*<div>
import { useCallback, useEffect, useState } from 'react';
import classes from "./addFaq.module.css";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal } from '@mui/material';
//import { v4 as uuidv4 } from 'uuid';

interface Faq {
  id: string
  question: string;
  answer: string;
}


export default function AddFaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorstates, seterrorstates] = useState({
      sameslug: false, emptytext: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const timestamp = serverTimestamp(); 
  const [createdAt, setCreatedAt] = useState(Timestamp.now);
  const [newSection, setNewSection] = useState<Faq>({
    id: "",
    question: "",
    answer: "",
  });
  const firestore = getFirestore()

  const fetchFaqs = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "faq")); //querySnapshot
    const fetchedBlogs: Faq[] = [];
    querySnapshot.forEach((doc) => {
      const blogData = doc.data() as Faq;
      blogData.id = doc.id;
      fetchedBlogs.push(blogData);
      console.log(blogData);
    });
    setFaqs(fetchedBlogs);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchFaqs();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, [fetchFaqs]);
//Real-time update
  useEffect(() => {
    const firestore = getFirestore();
    const unsubscribe = onSnapshot(collection(firestore, 'faq'), (querySnapshot) => {
      const updatedBlogs: Faq[] = [];
      querySnapshot.forEach((doc) => {
        const blogData = doc.data() as Faq;
        blogData.id = doc.id;
        updatedBlogs.push(blogData);
      });
      setFaqs(updatedBlogs);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Type guard to check if the error is of type FirebaseStorageError
  function isFirebaseStorageError(error: any): error is FirebaseStorageError {
    return error && error.code && typeof error.code === "string";
  }

  // Custom type for Firebase storage errors
  interface FirebaseStorageError {
    code: string;
    message: string;
    name: string;
  }

  const handleAddFaq = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };
  //const generateUniqueID = () => {
    //const uniqueID = uuidv4();
    //return uniqueID;
  //};

  const handleCreateFaq = async () => {
  if (newSection.question === '') {
    seterrorstates({ ...errorstates });
  } else if (newSection.answer === '') {
    seterrorstates({ ...errorstates});
  } else {
    //const id = generateUniqueID;
    //console.log(id)
    try {
      const docRef = await addDoc(collection(firestore, 'faq'), newSection);
      setModalMessage("FAQ added.");
      setIsModalOpen(true);
      fetchFaqs()
      setShowModal(false)
    } 
      catch (error) {
      setModalMessage("An error occurred while creating the faq.");
      setIsModalOpen(true);
    }
  }
};

const handleDeleteFaq = async (blogId: string) => {
    console.log(blogId)
  const docRef = doc(getFirestore(), "faq", blogId);

  try {
    await deleteDoc(docRef).then(()=>{fetchFaqs()});
    setModalMessage("FAQ successfully deleted.");
    setIsModalOpen(true);
  } catch (error) {
    setModalMessage("An error occurred while deleting the blog.");
    setIsModalOpen(true);
  }
};

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.titleContainer}>
            <h3 className={classes.title} style={{ marginRight: '150px' }}>No.</h3>
            <h3 className={classes.title} style={{ marginLeft: '30px' }}>Question/Answer</h3>
          </div>
          <div>
            {faqs.map((faq, index) => (
              <div key={faq.id} className={classes.blogContainer}>
                  <div className={classes.smallContainer}>
                    <p className={classes.text}>{index + 1}.</p>
                    <p className={classes.question}>{faq.question}</p>
                    <p className={classes.answer}>{faq.answer}</p>
                  </div>
                <DeleteIcon
                  className={classes.deleteIcon}
                  onClick={() => handleDeleteFaq(faq.id)}
                />
              </div>
              
            ))}
          </div>
          <button style={{ width: "100%",zIndex:"3" }} className={classes.button} onClick={handleAddFaq}>
            Add FAQ
          </button>
          {showModal && (
        <div className={classes.modal}>
          <div className={classes.modalContainer}>
            <h2>Add FAQ</h2>
              {/* Add the modal content to prompt the admin to add the title and slug *///}
              /*<input
                type="text"
                placeholder="Question"
                value={newSection.question}
                className={classes.modalInput}
                onChange={(e) => setNewSection({ ...newSection, question: e.target.value })}
              />
              <input
                type="text"
                placeholder="Answer"
                value={newSection.answer}
                className={classes.modalInput}
                onChange={(e) => setNewSection({ ...newSection, answer: e.target.value })}
              />
              <div className={classes.modalButtons}>
                <button className={classes.modalButton} onClick={() => handleCreateFaq()}>Add</button>
                <button className={classes.modalButton} onClick={() => {setShowModal(false);setNewSection({
          id: "",
          question: "",
          answer: "",})}}>Cancel</button>  
             </div>
          </div>
        </div>
          )}
          
          
         {/* Modal *///}
          /*<Modal open={isModalOpen} onClose={closeModal} className={classes.modal}>
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
}*/