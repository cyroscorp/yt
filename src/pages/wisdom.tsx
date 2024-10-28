import { useState, useRef } from 'react';
import soundFile from './x/b.mp3'; // Import the MP3 file for quote
import song1 from './x/memory.mp3'; // Import other MP3 files for music player
import song2 from './x/fainted.mp3';
import winter from './music/winter.mp3';
import p from './music/a.mp3';

const QuoteBox = () => {
  // List of quotes
  const quotes = [
    "Don't explain your philosophy. Embody it",
    "It is not the man who has too little, but the man who craves more, that is poor",
    "The best revenge is to be unlike him who performed the injury",
    "You are a little soul carrying around a corpse.",
    "We suffer more often in imagination than in reality.",
    "No man is free who is not a master of himself",
    "Don't watch the clock; do what it does. Keep going.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Do not waste time on what you cannot control",
    "The universe is change; our life is what our thoughts make it",
    "Wealth consists not in having great possessions, but in having few wants",
    "It's not what happens to you, but how you react to it that matters.",
    "You have power over your mind—not outside events. Realize this, and you will find strength",
    "Waste no more time arguing about what a good man should be. Be one",
    "If you want to be great, you have to be willing to be misunderstood",
    "Suffering is the true test of life.",
    "You are not going to find your greatness in your comfort zone.",
  ];

  // List of songs
  const songs = [
    { title: "Memory Reboot", file: song1 },
   
    { title: "Fainted", file: song2 },
    { title: "Captain America Winter Soldier theme", file: winter },
    { title: "Pangura Ban", file: p },
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
    <div className="flex flex-row bg-gray-900 items-center justify-center h-50% space-x-8">
      <div className="bg-black p-6 rounded-lg shadow-md w-80 text-center">
        <p className="text-white mb-4">{quotes[currentQuoteIndex]}</p>
        <button
          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={showNextQuote}
        >
          Show Next Quote
        </button>
      </div>
      
      <div className="bg-black p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-white mb-4">{songs[currentSongIndex].title}</h2>
        <div className="mb-4">
          <button
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-colors mr-2"
            onClick={playPreviousSong}
          >
            Previous
          </button>
          <button
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={togglePlayPause}
          >
            Play/Pause
          </button>
          <button
            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition-colors ml-2"
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
