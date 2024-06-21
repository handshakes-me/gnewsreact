import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('general');
  const [search, setSearch] = useState('');
  const [apiKeyIndex, setApiKeyIndex] = useState(0); // State to track the current API key index
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(4); // State for items per page

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiKeys = process.env.REACT_APP_API_KEYS.split(','); // Split the API keys into an array
      if (!apiKeys.length) {
        console.error("API keys are undefined. Check your .env file.");
        return;
      }
      const apiKey = apiKeys[apiKeyIndex]; // Use the current index to get the API key
      try {
        const url = `https://gnews.io/api/v4/search?q=${category}&lang=en&country=in&max=10&token=${apiKey}`;
        const response = await axios.get(url);
        console.log(response.data.articles);
        setNews(response.data.articles);
      } catch (error) {
        console.error("An error occurred with the current API key:", error);
        if (apiKeyIndex < apiKeys.length - 1) {
          setApiKeyIndex(apiKeyIndex + 1); // Switch to the next API key
        } else {
          console.error("All API keys have failed.");
        }
      }
    };

    fetchData();
  }, [category, apiKeyIndex]); // Also re-run the effect when apiKeyIndex changes

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory.toLowerCase());
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleCategoryChange(search);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <header>
        <h2>REACT-NEWS-APP</h2>
      </header>

      <div className='nav'>
        {['General', 'Business', 'Technology', 'Health', 'Science', 'Entertainment'].map((item) => (
          <p key={item} className='nav-item' onClick={() => handleCategoryChange(item)}>
            {item}
          </p>
        ))}
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Category"
            className="search-bar"
          />
          <button type="submit" className='search-button'><i className='fa fa-search'></i></button>
        </form>
      </div>
      <div className='container my-5'>
        <div className='row text-center'>
          {currentItems.map((val, index) => (
            <div key={index} className='col my-4'>
              <div className="card">
                <img src={val.image} className="card-img-top" alt="..."/>
                <div className="card-body">
                  <h5 className="card-title">{val.title}</h5>
                  <p className="card-text">{truncateText(val.description, 100)}</p>
                  <a href={val.url} className="btn btn-danger redbtn">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= news.length}>
          Next
        </button>
      </div>
    </>
  );
}

export default App;
