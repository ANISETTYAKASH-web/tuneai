export interface Location {
  lat: number;
  lng: number;
  address: string;
  language: string;
  state: string;
}

export interface UserPreferences {
  location: Location;
  genre: string;
  mood: string;
}

export interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  thumbnail: string;
}