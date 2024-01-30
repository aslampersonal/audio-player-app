import React, { useEffect, useState } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioSrc, audioname, onEnded, onPause, onStop, lastTime }) => {
  const [audio] = useState(new Audio(audioSrc));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (isPlaying) {
        audio.play().catch((error) => {
            console.error('Error playing audio:', error);
        });
      }
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      onEnded();
    });
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        onEnded();
      });
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audio, isPlaying, onEnded]);

  useEffect(() => {
    audio.src = audioSrc;
    audio.load();
    setCurrentTime(0);
    setIsLoaded(false);
    setProgress(0);
  }, [audio, audioSrc]);

  useEffect(() => {
    setCurrentTime(lastTime);
  }, [lastTime])

  const handlePlay = () => {
    if (!isLoaded) {
        audio.load();
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        });
    } else if (!isPlaying) {
        audio.currentTime = currentTime;
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause();
        setCurrentTime(audio.currentTime);
        localStorage.setItem('currentTime', audio.currentTime.toString());
    }
  };

  const handleStop = () => {
    if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        onStop();
    }
  };

  return (
    <div className={`audio-player ${isPlaying ? 'playing' : ''}`}>
      <div className="audio-controls">
        <button onClick={handlePlay} disabled={!isLoaded || isPlaying}>
          Play
        </button>
        <button onClick={handlePause} disabled={!isLoaded || !isPlaying}>
          Pause
        </button>
        <button onClick={handleStop} disabled={!isLoaded || !isPlaying}>
          Stop
        </button>
      </div>
      <div className="music-info">
        {isLoaded && (
          <p><strong>{audioname}</strong></p>
        )}
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
