import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSubmit = async (query: string) => {
    try {
      setLoading(true);
      setError(false);
    const data = await fetchMovies(query);
    setMovies(data);
    if (data.length === 0) {
      toast.error("No movies found for your request.");
      return;
    }
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
    
  }
  
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (    
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {loading && <Loader/>}
      {error ? <ErrorMessage/> :(movies.length > 0 && <MovieGrid movies={movies} onSelect={handleSelectMovie} />)}
      {isModalOpen && selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal} />)}
    </div>
  )
}
