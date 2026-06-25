import React, { useState } from 'react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Starting completely empty
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Put your real email API key between these quotes:
  const API_KEY = 'a20b530d'; 

  const searchMovies = async (title) => {
    if (!title.trim()) {
      setErrorMsg('Please type a movie title in the search box!');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(title.trim())}&apikey=${API_KEY}`);
      const data = await response.json();
      
      if (data.Response === "True") {
        setMovies(data.Search || []);
      } else {
        setMovies([]);
        setErrorMsg(data.Error || 'No movies found.');
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMsg('Network issues. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      backgroundColor: '#121214',
      color: '#e2e8f0',
      minHeight: '100vh',
      padding: '2rem 5%',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      color: '#ffffff',
      margin: '0 0 0.5rem 0',
    },
    subtitle: {
      color: '#9f7aea',
      margin: 0,
      fontSize: '1rem',
      letterSpacing: '1px',
    },
    searchForm: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      maxWidth: '500px',
      margin: '2rem auto 0',
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: '1px solid #2d2d34',
      backgroundColor: '#1a1a1e',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#9f7aea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    movieCard: {
      backgroundColor: '#1a1a1e',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #2d2d34',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    },
    poster: {
      width: '100%',
      height: '320px',
      objectFit: 'cover',
    },
    infoContainer: {
      padding: '1rem',
    },
    movieTitle: {
      fontSize: '1rem',
      margin: '0 0 0.5rem 0',
      color: '#ffffff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    meta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.85rem',
      color: '#a0aec0',
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>FlickFinder</h1>
        <p style={styles.subtitle}>MOVIE LISTING APPLICATION</p>
        
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input 
            style={styles.input}
            type="text" 
            placeholder="Search movie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#a0aec0', marginTop: '2rem' }}>Searching entries...</div>
      ) : (
        <>
          {errorMsg ? (
            <div style={{ textAlign: 'center', color: '#f56565', marginTop: '1rem', fontWeight: '500' }}>
              {errorMsg}
            </div>
          ) : movies.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096', marginTop: '3rem' }}>
              Your search results will appear here. Try typing a movie name!
            </div>
          ) : null}
          
          <div style={styles.grid}>
            {movies.map((movie) => (
              <div key={movie.imdbID} style={styles.movieCard}>
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster'} 
                  alt={movie.Title} 
                  style={styles.poster}
                />
                <div style={styles.infoContainer}>
                  <h3 style={styles.movieTitle} title={movie.Title}>{movie.Title}</h3>
                  <div style={styles.meta}>
                    <span>{movie.Year}</span>
                    <span style={{ textTransform: 'uppercase', color: '#9f7aea', fontWeight: 'bold' }}>{movie.Type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
