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
  isTrending: boolean;
  isHot: boolean;
};

export type Genre = {
  id: string;
  name: string;
};
