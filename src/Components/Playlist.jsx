import React, { useEffect, useState } from 'react';
import "./Playlist.css";

const Playlist = ({ playlist, onPlay, currentTrackIndex }) => {

    const [nowPlaying, setNowPlaying] = useState();
    useEffect(() => {
        setNowPlaying(currentTrackIndex);
    },[currentTrackIndex]);

    return (
    <div className="playlist">
        <h2>Playlist</h2>
        <ul>
        {playlist.map((audio, index) => (
            <li key={index} onClick={() => {onPlay(index); setNowPlaying(index)}} className={index === nowPlaying ? 'playing' : ''}>
            {audio.name}
            </li>
        ))}
        </ul>
    </div>
    );
};

export default Playlist;