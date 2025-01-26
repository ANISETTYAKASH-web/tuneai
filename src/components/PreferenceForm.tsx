import React, { useState } from 'react';
import { Music, Heart } from 'lucide-react';

interface PreferenceFormProps {
  onGenreSelect: (genre: string) => void;
  onMoodSelect: (mood: string) => void;
}

const genres = [
  'Bollywood', 'Classical Indian', 'Bhangra', 'Indie Pop', 'Sufi',
  'Folk', 'Hip Hop', 'Rock', 'Pop', 'Devotional'
];

const moods = [
  'Happy', 'Romantic', 'Party', 'Devotional', 'Sad',
  'Energetic', 'Relaxed', 'Nostalgic'
];

const PreferenceForm: React.FC<PreferenceFormProps> = ({
  onGenreSelect,
  onMoodSelect
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    onGenreSelect(genre);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
          <Music className="w-5 h-5" />
          Select Genre
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreSelect(genre)}
              className={`px-4 py-2 rounded-full border transition-colors
                ${selectedGenre === genre 
                  ? 'bg-orange-100 border-orange-500 text-orange-700' 
                  : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
          <Heart className="w-5 h-5" />
          Select Mood
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`px-4 py-2 rounded-full border transition-colors
                ${selectedMood === mood 
                  ? 'bg-orange-100 border-orange-500 text-orange-700' 
                  : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300'}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;