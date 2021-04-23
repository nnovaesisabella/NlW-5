import { GetStaticProps } from "next";
import styles from "./home.module.scss";//styles

import Image from "next/image";//image

import { api } from "../services/api";//Api
import Link from 'next/link';
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

//Formatação datas e horas
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";
import { converDurationToTime } from "../utils/convertDurationToTimeString";


//Typagem das props
type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {

  const {playing} = useContext(PlayerContext)
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2> Últimos lançamentos </h2>

        <ul>
          {latestEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                

                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}> 
                    <a > {episode.title}</a>
                    </Link>
                  <p>{episode.members}</p>
                  <span> {episode.publishedAt}</span>
                  <span> {episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playing(episode)}>
                  <img src="/play-green.svg" alt="Play episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2> Todos espisódios </h2>
        <table cellPadding={0}>
          <thead>
            <th></th>
            <th> PodCast</th>
            <th> Integrantes</th>
            <th> Data </th>
            <th> Duração </th>
              <th></th>
        </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover"/>
                  </td>
                 
                  <td>
                    <Link href={`/episodes/${episode.id}`}> 
                      <a >{episode.title}</a>
                      </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width:80}}>{episode.publishedAt}</td>
                  <td >{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar"/>
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //  limite de podcast carecados na tela 12, ordenados pela daata de publicação e em ordem decrescente
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });


   //dados do episódio
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBr,
      }),
      duration: Number(episode.file.duration),
      durationAsString: converDurationToTime(Number(episode.file.duration)),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2); //retornar 2 recentes podcasts
  const allEpisodes = episodes.slice(2, episodes.length); //retornar 2 recentes podcasts e os demais listados

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // a cada 8hrs será entregue um novo html
  };
};
