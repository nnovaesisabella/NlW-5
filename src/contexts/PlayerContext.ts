import { createContext } from 'react';


type Episode = {
    title: string,
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    playing: (episode: Episode) => void;
    togglePlay: () => void; //não recebe parâmetro e nem tem parâmetro 
    
}
export const PlayerContext = createContext({} as PlayerContextData )