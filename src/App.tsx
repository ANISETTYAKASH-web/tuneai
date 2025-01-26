import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LocationPicker from './components/LocationPicker';
import PreferenceForm from './components/PreferenceForm';
import SongGrid from './components/SongGrid';
import { Music } from 'lucide-react';
import { Location, Song } from './types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [genre, setGenre] = useState<string>('');
  const [mood, setMood] = useState<string>('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getSongRecommendations = async () => {
    if (!location || !genre || !mood) {
      alert('Please select all preferences first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are an expert Indian music recommendation system specializing in regional music. Based on these preferences:
        Location: ${location.address}
        State: ${location.state}
        Primary Language: ${location.language}
        Genre: ${genre}
        Mood: ${mood}
        
        Recommend exactly 9 popular songs with these criteria:
        1. At least 6 songs MUST be in ${location.language} language from ${location.state}
        2. Include 3 popular songs from other Indian languages
        3. Mix of recent hits and classic favorites
        4. All songs must be real with valid YouTube IDs
        5. Focus on high-quality official music videos
        
        Return ONLY a JSON array with exactly 9 objects containing:
        {
          "title": "Song Title (with language name in brackets for non-${location.language} songs)",
          "artist": "Artist Name",
          "youtubeId": "valid_youtube_id"
        }
        
        Example format for Telugu region:
        [
          {
            "title": "Tillu Anna DJ Pedithe",
            "artist": "Ram Miriyala",
            "youtubeId": "actual_youtube_id"
          },
          {
            "title": "Kesariya [Hindi]",
            "artist": "Arijit Singh",
            "youtubeId": "actual_youtube_id"
          }
        ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        // Extract JSON from the response
        const jsonStr = text.match(/\[[\s\S]*\]/)?.[0] || '';
        const recommendedSongs: Song[] = JSON.parse(jsonStr).map((song: Song) => ({
          ...song,
          thumbnail: `https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`
        }));

        if (!Array.isArray(recommendedSongs) || recommendedSongs.length === 0) {
          throw new Error('Invalid response format');
        }

        setSongs(recommendedSongs);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to process song recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to get recommendations. Please try again.');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-12 h-12 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Indian Music Recommender</h1>
          </div>
          <p className="text-gray-600">Discover the best regional and national music based on your location and mood</p>
        </header>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-md backdrop-blur-lg bg-opacity-90">
            <h2 className="text-2xl font-semibold mb-4">Select Your Location</h2>
            <LocationPicker onLocationSelect={setLocation} />
          </section>

          <section className="bg-white p-6 rounded-xl shadow-md backdrop-blur-lg bg-opacity-90">
            <h2 className="text-2xl font-semibold mb-4">Your Preferences</h2>
            <PreferenceForm
              onGenreSelect={setGenre}
              onMoodSelect={setMood}
            />
          </section>

          <div className="text-center">
            <button
              onClick={getSongRecommendations}
              disabled={loading || !location || !genre || !mood}
              className={`px-8 py-3 rounded-full text-white font-semibold
                ${loading || !location || !genre || !mood
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
                } transition-colors`}
            >
              {loading ? 'Finding the Perfect Songs...' : 'Get Recommendations'}
            </button>
            {error && (
              <p className="mt-4 text-red-600">{error}</p>
            )}
          </div>

          {songs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Recommended Songs</h2>
              <SongGrid songs={songs} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;