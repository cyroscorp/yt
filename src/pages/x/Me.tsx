import React, { useState, useEffect } from "react";
import alarmSoundFile from "./b.mp3"; // Import the alarm sound
import interactionSoundFile from "./b.mp3"; // Import the interaction sound

export default function PomodoroTimer() {
  const defaultWorkTime = 25 * 60; // 25 minutes in seconds
  const defaultBreakTime = 5 * 60; // 5 minutes in seconds

  const [time, setTime] = useState(defaultWorkTime);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // State for sound toggle

  // Create audio objects
  const alarmSound = new Audio(alarmSoundFile);
  const interactionSound = new Audio(interactionSoundFile);

  // Load timer settings from local storage
  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoro-time");
    const savedIsRunning = localStorage.getItem("pomodoro-isRunning");
    const savedOnBreak = localStorage.getItem("pomodoro-onBreak");

    if (savedTime) setTime(Number(savedTime));
    if (savedIsRunning) setIsRunning(JSON.parse(savedIsRunning));
    if (savedOnBreak) setOnBreak(JSON.parse(savedOnBreak));
  }, []);

  // Save timer settings to local storage
  useEffect(() => {
    localStorage.setItem("pomodoro-time", time);
    localStorage.setItem("pomodoro-isRunning", isRunning);
    localStorage.setItem("pomodoro-onBreak", onBreak);
  }, [time, isRunning, onBreak]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      if (onBreak) {
        setTime(defaultWorkTime);
        setOnBreak(false);
      } else {
        setTime(defaultBreakTime);
        setOnBreak(true);
      }
      setIsRunning(false);

      // Play the alarm sound if sound is enabled
      if (soundEnabled) {
        alarmSound.play();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, onBreak, soundEnabled]);

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Play sound function
  const playSound = () => {
    if (soundEnabled) {
      interactionSound.play();
    }
  };

  // Start or pause the timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    playSound(); // Play sound on toggle
  };

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTime(defaultWorkTime);
    playSound(); // Play sound on reset
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playSound(); // Play sound on toggle sound
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">
        {onBreak ? "Break Time" : "Work Time"}
      </h1>
      <p className="text-6xl font-mono mb-8">{formatTime(time)}</p>
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
        <button
          onClick={toggleSound}
          className={`${
            soundEnabled ? "bg-green-500" : "bg-gray-500"
          } hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
        >
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>
    </div>
  );
}
