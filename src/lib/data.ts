export type Episode = {
  id: string;
  title: string;
  duration: string;
  description: string;
};

export type Drama = {
  id: string;
  title: string;
  posterId: string;
  genre: string[];
  rating: number;
  isTrending: boolean;
  isHot: boolean;
  synopsis: string;
  episodes: Episode[];
};

const dramas: Drama[] = [
  {
    id: '1',
    title: 'The Untamed',
    posterId: 'poster-1',
    genre: ['Fantasy', 'Wuxia', 'Adventure'],
    rating: 4.9,
    isTrending: true,
    isHot: true,
    synopsis: 'Wei Wuxian and Lan Wangji, two talented disciples of respectable clans, meet during cultivation training and accidentally discover a secret carefully hidden for many years.',
    episodes: [
      { id: '101', title: 'Episode 1', duration: '45min', description: 'The story begins with the infamous Yiling Patriarch, Wei Wuxian, dying.' },
      { id: '102', title: 'Episode 2', duration: '44min', description: 'Wei Wuxian is resurrected in the body of Mo Xuanyu and reunites with Lan Wangji.' },
    ],
  },
  {
    id: '2',
    title: 'Ashes of Love',
    posterId: 'poster-2',
    genre: ['Romance', 'Fantasy', 'Xianxia'],
    rating: 4.8,
    isTrending: true,
    isHot: false,
    synopsis: 'A frost flower fairy who is unable to feel emotion is caught in a love triangle with two warring deities.',
    episodes: [
      { id: '201', title: 'Episode 1', duration: '46min', description: 'Jinmi, the daughter of the Flower Deity, lives a carefree life until she meets the Fire God, Xufeng.' },
    ],
  },
  {
    id: '3',
    title: 'Go Go Squid!',
    posterId: 'poster-3',
    genre: ['Romance', 'Comedy', 'E-sports'],
    rating: 4.7,
    isTrending: true,
    isHot: true,
    synopsis: 'A cute and soft-hearted singer develops a crush on a legendary genius in the professional gaming world.',
    episodes: [
      { id: '301', title: 'Episode 1', duration: '42min', description: 'Tong Nian falls in love at first sight with the professional gamer Han Shangyan.' },
    ],
  },
  {
    id: '4',
    title: "The King's Avatar",
    posterId: 'poster-4',
    genre: ['E-sports', 'Action', 'Adventure'],
    rating: 4.9,
    isTrending: true,
    isHot: false,
    synopsis: 'In the multiplayer online game Glory, Ye Xiu is well known as the textbook-level expert and a top-tier player.',
    episodes: [
       { id: '401', title: 'Episode 1', duration: '40min', description: 'Top player Ye Xiu is forced to retire from his professional team.' },
    ],
  },
  {
    id: '5',
    title: 'Love O2O',
    posterId: 'poster-5',
    genre: ['Romance', 'Comedy', 'Youth'],
    rating: 4.6,
    isTrending: false,
    isHot: false,
    synopsis: 'What is it that makes a man fall in love with a woman at first sight? Appearance? Aura? Wealth? NO, when campus prince and gaming expert, student Xiao Nai first saw Bei Wei Wei, what made him fall in love was not her extraordinary beauty, but her slim and slender fingers that were flying across the keyboard!',
    episodes: [
       { id: '501', title: 'Episode 1', duration: '45min', description: 'Bei Wei Wei gets dumped by her in-game husband.' },
    ],
  },
  {
    id: '6',
    title: 'Eternal Love',
    posterId: 'poster-6',
    genre: ['Fantasy', 'Romance', 'Xianxia'],
    rating: 4.8,
    isTrending: true,
    isHot: false,
    synopsis: 'The story of Bai Qian, a goddess and monarch from the Heavenly Realms, and her love story with Ye Hua, the Crown Prince.',
    episodes: [],
  },
  {
    id: '7',
    title: 'Nirvana in Fire',
    posterId: 'poster-7',
    genre: ['Historical', 'Wuxia', 'Political'],
    rating: 5.0,
    isTrending: false,
    isHot: false,
    synopsis: 'During the 4th-century, war broke out between the feudal Northern Wei and Southern Liang dynasties. The Liang commander, Lin Xie, his 17-year-old son, Lin Shu, and the Chiyan army were wrongly framed and executed. Lin Shu survives and returns 12 years later as Mei Changsu to seek justice.',
    episodes: [],
  },
  {
    id: '8',
    title: 'The Story of Minglan',
    posterId: 'poster-8',
    genre: ['Historical', 'Romance', 'Family'],
    rating: 4.9,
    isTrending: false,
    isHot: true,
    synopsis: 'The story of Minglan, the unfavored sixth daughter of an official, who learns to survive and eventually thrive in a world of treachery and conspiracy.',
    episodes: [],
  },
  {
    id: '9',
    title: 'Joy of Life',
    posterId: 'poster-9',
    genre: ['Historical', 'Sci-fi', 'Political'],
    rating: 4.9,
    isTrending: true,
    isHot: true,
    synopsis: 'A young man with a modern mindset is reborn into an ancient empire, navigating a world of political intrigue, martial arts, and hidden powers.',
    episodes: [],
  },
  {
    id: '10',
    title: 'Hidden Love',
    posterId: 'poster-10',
    genre: ['Romance', 'Youth', 'Modern'],
    rating: 4.7,
    isTrending: true,
    isHot: true,
    synopsis: 'Sang Zhi falls in love with Duan Jiaxu, a boy who often comes to her house to play games in her older brother\'s room. He is seven years older than her. Sang Zhi had a crush on Duan Jiaxu when she was young, but they lost contact with each other for some reason. After she graduates, she joins the university in the city he is in, and they meet again.',
    episodes: [],
  },
];

const genres = [...new Set(dramas.flatMap(d => d.genre))];

export function getDramas() {
  return dramas;
}

export function getDramaById(id: string) {
  return dramas.find(d => d.id === id);
}

export function getTrendingDramas() {
  return dramas.filter(d => d.isTrending);
}

export function getGenres() {
  return genres;
}
