import { useState, useRef } from 'react';
import soundFile from './x/b.mp3'; // Import the MP3 file for quote
import song1 from './x/memory.mp3'; // Import other MP3 files for music player
import song2 from './x/fainted.mp3';

const QuoteBox = () => {
  // List of quotes
  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "Your time is limited, so don't waste it living someone else's life.",
    "The best way to predict the future is to create it.",
    "Do not wait to strike till the iron is hot, but make it hot by striking.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Act as if what you do makes a difference. It does."
  ];

  // List of songs
  const songs = [
    { title: "Song 1", file: song1 },
    { title: "Song 2", file: song2 }
  ];

  // State for quotes, music player, and audio
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(songs[0].file));

  // Function to show the next quote and play sound
  const showNextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);

    // Play the quote sound
    const quoteAudio = new Audio(soundFile);
    quoteAudio.play();
  };

  // Function to toggle play/pause for music
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Function to play the next song
  const playNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    audioRef.current.src = songs[nextIndex].file;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Function to play the previous song
  const playPreviousSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    audioRef.current.src = songs[prevIndex].file;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-row items-center justify-center h-50% space-x-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80 text-center">
        <p className="text-lg mb-4">{quotes[currentQuoteIndex]}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={showNextQuote}
        >
          Show Next Quote
        </button>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-xl mb-4">{songs[currentSongIndex].title}</h2>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
            onClick={playPreviousSong}
          >
            Previous
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={togglePlayPause}
          >
            Play/Pause
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ml-2"
            onClick={playNextSong}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
