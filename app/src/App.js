import React, { useState } from "react";
import audio from "./Assets/Audio/song.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faStop,
    faPlus,
    faMinus,
    faVolumeUp,
    faPause,
    faVolumeMute
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
    const [playerRef, setPlayerRef] = useState();
    const [shouldPlay, setShouldPlay] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const playAudio = () => {
        setShouldPlay(!shouldPlay);
        shouldPlay ? playerRef.play() : playerRef.pause();
    };

    const getFormattedTime = seconds => {
        return new Date(seconds * 1000)
            .toUTCString()
            .match(/(\d\d:\d\d:\d\d)/)[0];
    };

    const stopAudio = () => {
        playerRef.currentTime = 0;
        setShouldPlay(true);
        playerRef.pause();
    };

    const muteAudio = () => {
        setIsMuted(!isMuted);
    };

    const onVolumePlus = () => {
        const volume = playerRef.volume;
        const isValidVolume = volume < 1;
        if (isValidVolume) {
            playerRef.volume = (volume + 0.1).toFixed(2);
        }
    };

    const onVolumeMinus = () => {
        const volume = playerRef.volume;
        const isValidVolume = volume > 0;
        if (isValidVolume) {
            playerRef.volume = (volume - 0.1).toFixed(2);
        }
    };

    const getTimePercentage = () => {
        const percentage = (currentTime / duration) * 100;
        return percentage.toFixed(2);
    };

    const onSelectTime = e => {
        const seekPosition = e.pageX - e.target.offsetLeft;
        const seekWidth = e.target.offsetWidth;
        const percentageOfSeekPosition = (seekPosition / seekWidth) * 100;
        playerRef.currentTime = (percentageOfSeekPosition * duration) / 100;
        setCurrentTime((percentageOfSeekPosition * duration) / 100);
    };

    const resetPlayer = () => {
        playerRef.currentTime = 0;
        setShouldPlay(true);
    };
    const renderTimeAndPercentage = () => (
        <div id="time-percentage-wrapper">
            <div id="time">
                {getFormattedTime(currentTime)}/{getFormattedTime(duration)}
            </div>
            <div id="percentage">
                {currentTime ? getTimePercentage() : "--"}%
            </div>
        </div>
    );

    const renderPlayerControls = () => (
        <div id="player-controls">
            <div id="play-pause" onClick={playAudio}>
                {shouldPlay ? (
                    <FontAwesomeIcon icon={faPlay} />
                ) : (
                    <FontAwesomeIcon icon={faPause} />
                )}
            </div>
            <div id="stop" onClick={stopAudio}>
                <FontAwesomeIcon icon={faStop} />
            </div>
            <div id="mute" onClick={muteAudio}>
                {isMuted ? (
                    <FontAwesomeIcon icon={faVolumeMute} />
                ) : (
                    <FontAwesomeIcon icon={faVolumeUp} />
                )}
            </div>
            <div id="volume-plus" onClick={onVolumePlus}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
            <div id="volume-minus" onClick={onVolumeMinus}>
                <FontAwesomeIcon icon={faMinus} />
            </div>
        </div>
    );

    const renderAudio = () => (
        <audio
            onPlaying={() =>
                setInterval(() => setCurrentTime(playerRef.currentTime), 1000)
            }
            src={audio}
            id="player"
            onLoadedData={() => {}}
            muted={isMuted}
            onEnded={resetPlayer}
            ref={audio => {
                setPlayerRef(audio);
            }}
        />
    );

    const renderTimeline = () => (
        <div id="timeline">
            <div
                id="handle"
                style={{ width: `${getTimePercentage().toString()}%` }}
            />
            <div id="seeker" onClick={onSelectTime}></div>
        </div>
    );

    return (
        <div id="app" onLoadedData={() => setDuration(playerRef.duration)}>
            <div id="audio-player-box">
                {renderTimeAndPercentage()}
                {renderPlayerControls()}
                {renderAudio()}
                {renderTimeline()}
            </div>
        </div>
    );
};

export default App;
