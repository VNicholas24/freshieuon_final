import React from 'react';
import styles from './searchBar.module.css';
import SearchIcon from '@mui/icons-material/Search';
import "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";



interface FaqQuestion {
  question: string;
  answer: string;
}

const FindQuestion: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FaqQuestion[]>([]);
  

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const firestore = getFirestore();
  const questionsRef = collection(firestore, 'faq');
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      try {
        const snapshot = await getDocs(questionsRef);
        const filteredResults = snapshot.docs
          .map((doc) => doc.data() as FaqQuestion)
          .filter((question) =>
            question.question.toLowerCase().includes(query.toLowerCase())
          );
        setSearchResults(filteredResults);
        console.log('Searching...');
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
  }; 
    

  
    return (
      <div className='input-wrapper'>
        <input
          type="text"
          className={styles['search-bar']}
          placeholder="Have a question? Look it up..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <ul>
        {searchResults.length > 0 ? (
          searchResults.map((question) => (
            <li key={question.question}>
              <p>{question.question}</p>
              <p>{question.answer}</p>
            </li>
          ))
        ) : (
          <li>No results found.</li>
        )}
      </ul>
     <div>
        <SearchIcon className={styles['searchIcon']} ></SearchIcon>
     </div>
      </div>
    );
  };
  
  export default FindQuestion;
  
  