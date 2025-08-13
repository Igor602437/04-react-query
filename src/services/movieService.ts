import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = 'https://api.themoviedb.org/3';
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

interface TmdbResponse {
  results: Movie[];
  page?: number;
  total_pages?: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const axiosOptions = {
    params: {
      page: 1,
      query: query,
    },
  };

  const response = await axios.get<TmdbResponse>('/search/movie', axiosOptions);
  return response.data.results;
};
