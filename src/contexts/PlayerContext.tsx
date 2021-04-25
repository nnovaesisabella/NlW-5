import { createContext, ReactNode, useState } from 'react';


type Episode = {
    title: string,
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

//passar todas as funções e o tipo 
type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    playing:(episode: Episode) => void;
    playList:(list: Episode[], index: number) => void;//receber lista de episódios
    togglePlay: () => void; //não recebe parâmetro 
    setPlayningState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
   
    
}
export const PlayerContext = createContext({} as PlayerContextData)


type PlayerContextProviderProps = {
    children: ReactNode; //qualquerr contéudo aceito pelo JSX
}

export function PlayerContextProvider({children}:PlayerContextProviderProps ) {
     const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  //passar qual é o tipo 
  const playing = (episode:Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0); 
    setIsPlaying(true); 
  }

  //lista de episódios e receber o index do episódio clicado
  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true)
  }

  const togglePlay =() => {setIsPlaying(!isPlaying)} //play no episode 

  const setPlayningState = (state: boolean) => { setIsPlaying(state) }
  
 
  //episósdio que está tocando atualmente +1 (tocar o próximo episóde)
  const playNext = () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex < episodeList.length) {     
        setCurrentEpisodeIndex(currentEpisodeIndex +1)
    }
   
  }

  const playPrevious = () => {
    if (currentEpisodeIndex > 0) {
       setCurrentEpisodeIndex(currentEpisodeIndex -1)
     }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      playing,
       playNext,
      playPrevious,
      isPlaying,
      togglePlay,
      playList,
      setPlayningState,
     
      

      }}>
          
          {children}
          
    </PlayerContext.Provider>)
}