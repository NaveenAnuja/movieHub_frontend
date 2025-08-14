import { MovieCategory } from '../movie/movieCategory.enum';

export interface Movie {
  id: number;
  movieName: string;
  description: string;
  rate: number;
  category: MovieCategory;
  imageUrl: string;
}