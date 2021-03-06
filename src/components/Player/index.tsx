import Image from "next/image";
import { useContext, useRef, useEffect } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import Slider from "rc-slider"; //progress ádio

//styles
import styles from "./styles.module.scss";
import "rc-slider/assets/index.css";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayningState,
    playNext,
    playPrevious,
  } = useContext(PlayerContext);

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
          <span> 00:00 </span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ backgroundColor: "#04d361" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span> 00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayningState(true)}
            onPause={() => setPlayningState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="./shuffle.svg" alt="Ordem aleatória" />
          </button>

          <button type="button" disabled={!episode}>
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
              <img src="play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode} onClick={playNext}>
            <img src="./play-next.svg" alt="Próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="./repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
