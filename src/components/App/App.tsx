import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar';
import type { Movie, TmdbResponse } from '../../types/movie';
import { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

export default function App() {

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, isError, isSuccess } = useQuery<TmdbResponse>({
    queryKey: ['moviesSearch', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query!=='',
    placeholderData: keepPreviousData,
  })

  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
  if (isSuccess && data.results.length === 0) {
    toast.error("No movies found for your request.");
    return;
    }
  }, [isSuccess, data]);

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
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←" />)}
      {isLoading && <Loader />}
      {isError && <ErrorMessage/>}
      {data?.results && data?.results.length > 0 && <MovieGrid movies={data.results} onSelect={handleSelectMovie} />}
      {isModalOpen && selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal} />)}
    </div>
  )
}
