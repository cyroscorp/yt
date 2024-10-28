import { useState, useEffect } from "react";
import alarmSoundFile from "./b.mp3"; // Import the alarm sound
import interactionSoundFile from "./b.mp3"; // Import the interaction sound

export default function PomodoroTimer() {
  const defaultWorkTime = 25 * 60; // 25 minutes in seconds
  const defaultBreakTime = 5 * 60; // 5 minutes in seconds

  const [time, setTime] = useState(defaultWorkTime);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const alarmSound = new Audio(alarmSoundFile);
  const interactionSound = new Audio(interactionSoundFile);

  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoro-time");
    const savedIsRunning = localStorage.getItem("pomodoro-isRunning");
    const savedOnBreak = localStorage.getItem("pomodoro-onBreak");

    if (savedTime) setTime(Number(savedTime));
    if (savedIsRunning) setIsRunning(JSON.parse(savedIsRunning));
    if (savedOnBreak) setOnBreak(JSON.parse(savedOnBreak));
  }, []);

  useEffect(() => {
    localStorage.setItem("pomodoro-time", time.toString());
    localStorage.setItem("pomodoro-isRunning", JSON.stringify(isRunning));
    localStorage.setItem("pomodoro-onBreak", JSON.stringify(onBreak));
  }, [time, isRunning, onBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (interval) {
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

      if (soundEnabled) {
        alarmSound.play();
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time, onBreak, soundEnabled]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const playSound = () => {
    if (soundEnabled) {
      interactionSound.play();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    playSound();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setOnBreak(false);
    setTime(defaultWorkTime);
    playSound();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    playSound();
  };

  return (
    <div className="bg-black p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-white font-bold mb-4">
        {onBreak ? "Break Time" : "Work Time"}
      </h1>
      <p className="text-6xl text-white font-mono mb-8">{formatTime(time)}</p>
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
        <button
          onClick={toggleSound}
          className={`${
            soundEnabled ? "bg-green-500" : "bg-gray-500"
          } hover:bg-green-700 text-black font-bold py-2 px-4 rounded`}
        >
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>
    </div>
  );
}
