import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import RenderedSecondSection from "./renderedSecondSection";
import classes from "./detailedPageSection.module.css";
import { Modal, Button } from "@mui/material";

interface PageSection {
  id: string;
  title: string;
  iconUrl: string;
  description: string;
  pageUrl:string;
}

export default function DetailedPageSecondSection() {
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSection, setNewSection] = useState<PageSection>({
    id: "",
    title: "",
    iconUrl: "",
    description: "",
    pageUrl:""
  });
  const [errorstates, seterrorstates] = useState({
    sameslug: false,
    emptytext: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchPageSections = useCallback(async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "tips-aboutus-mid-section"));
    const fetchedPageSections: PageSection[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id.startsWith("welcome-to")) {
        const pageData = doc.data() as PageSection;
        pageData.id = doc.id;
        fetchedPageSections.push(pageData);
      }
    });
    setPageSections(fetchedPageSections);
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      fetchPageSections();
    }, 100);
    return () => clearTimeout(timeOutId);
  }, []);

  const handleCreateSection = (newSection: PageSection) => {
    setPageSections((prevPageSections) => [...prevPageSections, newSection]);
    setShowModal(false);
  };

  const handleDeleteSection = async (id: string) => {
    if (!id) throw Error;
    const docRef = doc(getFirestore(), "tips-aboutus-mid-section", id);

    try {
      await deleteDoc(docRef);

      // Filter out the deleted section from the pageSections state
      setPageSections((prevPageSections) =>
        prevPageSections.filter((section) => section.id !== id)
      );

      fetchPageSections();

      setModalMessage("Successfully deleted");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("An error occurred while deleting the section.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  console.log('de 2')

  return (
    <div>
      {pageSections.map((section, index) => (
        <RenderedSecondSection
          key={section.id + index}
          index={index+1}
          id={section.id}
          sectionTitle={section.title}
          sectionDescription={section.description}
          sectionImageUrl={section.iconUrl}
          onDeleteSection={handleDeleteSection}
          fetchPageSections={fetchPageSections}
          num={pageSections.length.toString()}
          sectionPageUrl={section.pageUrl}
        />
      ))}
      <button
        className={classes.button}
        onClick={() => handleCreateSection(newSection)}
      >
        Add More Section
      </button>
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
  );
}
