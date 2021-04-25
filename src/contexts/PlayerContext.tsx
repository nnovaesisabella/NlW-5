import { createContext, ReactNode, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

//passar todas as funções e o tipo
type PlayerContextData = {
  episodeList: Episode[];
  isLooping: boolean;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isShuffling: boolean;
  playing: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void; //receber lista de episódios
  togglePlay: () => void; //não recebe parâmetro
  setPlayningState: (state: boolean) => void;
  playNext: () => void;
  loopPlay: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  playPrevious: () => void;
  toggleShuffling: () => void;
  clearPlayerState: () => void
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode; //qualquerr contéudo aceito pelo JSX
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false)

  //passar qual é o tipo
  const playing = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  //lista de episódios e receber o index do episódio clicado
  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }; //play no episode

  const setPlayningState = (state: boolean) => {
    setIsPlaying(state);
  };


  const loopPlay = () => {

      setIsLooping(!isLooping)
  }

  const toggleShuffling = () => {
    
    setIsShuffling(!isShuffling)
  }

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious =  currentEpisodeIndex > 0
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length

  //episósdio que está tocando atualmente +1 (tocar o próximo episóde)
  const playNext = () => {

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
      
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        hasPrevious,
        hasNext,
        episodeList,
        currentEpisodeIndex,
        loopPlay,
        playing,
        playNext, 
        playPrevious,
        isPlaying,
        isShuffling,
        togglePlay,
        playList,
        setPlayningState,
        isLooping,
        toggleShuffling,
        clearPlayerState
      

       
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
