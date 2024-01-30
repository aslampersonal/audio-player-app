import React, { useState, useEffect } from 'react';
import { useSound } from 'use-sound';
import { useDropzone } from 'react-dropzone';
import AudioPlayer from './Components/AudioPlayer';
import Playlist from './Components/Playlist';
import './App.css';

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleTrackEnded = () => {
    if (currentTrackIndex !== null && currentTrackIndex < playlist.length - 1) {
      const nextTrackIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextTrackIndex);
      play({ sound: playlist[nextTrackIndex].audioSrc, position: currentTime });
    } else {
      setCurrentTrackIndex(null);
    }
  };

  const [play, { stop }] = useSound({
    sound: playlist[currentTrackIndex]?.audioSrc || '',
    volume: 1,
    loop: false,
    onend: handleTrackEnded,
  });

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(storedPlaylist);

    const storedIndex = parseInt(localStorage.getItem('currentTrackIndex'), 10) || 0;
    setCurrentTrackIndex(storedIndex);

    const storedTime = parseFloat(localStorage.getItem('currentTime')) || 0;
    setCurrentTime(storedTime);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('playlist', JSON.stringify(playlist));
      localStorage.setItem('currentTrackIndex', currentTrackIndex);
    }
  }, [playlist, currentTrackIndex, currentTime, loading]);

  const onDrop = (acceptedFiles) => {
    const newPlaylist = acceptedFiles.map((file) => ({
      name: file.name,
      audioSrc: URL.createObjectURL(file),
    }));
    setPlaylist([...playlist, ...newPlaylist]);
    setCurrentTrackIndex(null);
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
    stop();
    play({
      sound: playlist[index].audioSrc,
      position: currentTime,
    });
  };

  const handlePause = () => {
    stop();
  };

  const handleStop = () => {
    stop();
    setCurrentTrackIndex(null);
  };

  const handleClearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrackIndex(null);
    setCurrentTime(0);
    localStorage.removeItem('playlist');
    localStorage.removeItem('currentTrackIndex');
    localStorage.removeItem('currentTime');
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="app-container">
      <h1>Audio Player App</h1>
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some audio files here, or click to select files</p>
      </div>
      <div className="music-player-container">
        {!loading && playlist.length > 0 && (
          <>
            <AudioPlayer
              audioSrc={playlist[currentTrackIndex]?.audioSrc}
              audioname={playlist[currentTrackIndex]?.name}
              onEnded={handleTrackEnded}
              onPause={handlePause}
              onStop={handleStop}
              lastTime={currentTime}
            />
            <Playlist playlist={playlist} onPlay={handlePlay} currentTrackIndex={currentTrackIndex} />
          </>
        )}
        <button className="clear-playlist-button" onClick={handleClearPlaylist}>
          Clear Playlist
        </button>
      </div>
    </div>
  );
};

export default App;
