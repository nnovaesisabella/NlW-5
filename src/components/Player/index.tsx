import Image from "next/image";
import { useContext, useRef, useEffect, useState } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import Slider from "rc-slider"; //progress ádio

//styles
import styles from "./styles.module.scss";
import "rc-slider/assets/index.css";
import { converDurationToTime } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress]=useState(0)
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isShuffling,
    togglePlay,
    setPlayningState,
    playNext,
    playPrevious,
    hasPrevious,
    hasNext,
    isLooping,
    loopPlay,
    toggleShuffling,
    clearPlayerState
    
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener = () => {
    
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }
  
  const handleSeek = (amount:number) => {
    
    audioRef.current.currentTime = amount;
    setProgress(amount)

  }

  const handleEpisodeEnded = () => {
    
    if (hasNext) {
      playNext()
    } else {

      clearPlayerState();
    }
  }
  
  const episode = episodeList[currentEpisodeIndex];
  

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong> Tocando agora </strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={800}
            height={592}
            src={episode.thumbnail}
            objectFit="fill"
          />
          <strong> {episode.title}</strong>
          <span> {episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong> Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span> { converDurationToTime(progress)} </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                onChange={handleSeek}
                value={progress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ backgroundColor: "#04d361" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span> { converDurationToTime(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayningState(true)}
            onPause={() => setPlayningState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffling}
            className={isShuffling ? styles.isActive : ''}
          
          >
            <img src="./shuffle.svg" alt="Ordem aleatória" />
          </button>

          <button type="button" disabled={!episode || !hasPrevious}>
            <img src="./play-previous.svg" alt="Voltar" onClick={playPrevious}/>
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="./pause.svg" alt="Pause" />
            ) : (
              <img src="./play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="./play-next.svg" alt="Próxima" />
          </button>
          <button type="button" disabled={!episode} onClick={loopPlay} className={isLooping ? styles.isActive : ''}>
            <img src="./repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}