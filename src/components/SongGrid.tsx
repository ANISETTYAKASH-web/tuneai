import React, { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';

interface Song {
  youtubeId: string;
  title?: string;
  artist?: string;
  thumbnail?: string;
}

interface SongGridProps {
  songs: Song[];
}

const SongGrid: React.FC<SongGridProps> = ({ songs }) => {
  const [videoDetails, setVideoDetails] = useState<{ [key: string]: Song }>({});

  // Fetch video details from YouTube Data API
  useEffect(() => {
    const fetchVideoDetails = async () => {
      const apiKey = 'AIzaSyC6uEL5dGXdbdRfO964IaKUK3Qbe0GD_PE'; // Replace with your API key
      const videoIds = songs.map((song) => song.youtubeId).join(',');

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${apiKey}`
        );
        const data = await response.json();

        const details: { [key: string]: Song } = {};
        data.items.forEach((item: any) => {
          details[item.id] = {
            youtubeId: item.id,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
          };
        });

        setVideoDetails(details);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [songs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song, index) => {
        const details = videoDetails[song.youtubeId] || song;

        return (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Thumbnail and Play Button */}
            <div className="relative aspect-video">
              <img
                src={details.thumbnail || 'https://via.placeholder.com/320x180'}
                alt={details.title}
                className="w-full h-full object-cover"
              />
              <a
                href={`https://www.youtube.com/watch?v=${details.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="flex flex-col items-center gap-2">
                  <Youtube className="w-12 h-12 text-red-500" />
                  <span className="text-white font-medium">Play on YouTube</span>
                </div>
              </a>
            </div>

            {/* Song Details */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1" title={details.title}>
                {details.title || 'Loading...'}
              </h3>
              <p className="text-gray-600 line-clamp-1" title={details.artist}>
                {details.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SongGrid;