export type Episode = {
  id: string;
  dramaId: string;
  episodeNumber: number;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
};

export type Drama = {
  id: string;
  title: string;
  posterUrl: string;
  genreIds: string[];
  rating: number;
  isTrending: boolean;
  isHot: boolean;
  synopsis: string;
};

export type Genre = {
  id: string;
  name: string;
};
