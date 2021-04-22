import { GetStaticPaths, GetStaticProps } from "next";
import Image from 'next/image';
import Link from 'next/link'

import ptBR from "date-fns/locale/pt-BR";
import { format, parseISO } from "date-fns";
import { converDurationToTime } from "../../utils/convertDurationToTimeString";

import { api } from "../../services/api";

//Styles
import styles from "./episode.module.scss";

//typagem dados que serão inseridos na página
type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  url: string;
  description: string;
};

//typagem
type EpisodeProps = {
  episode: Episode;
};

export default function Episode({episode}: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
        <button type="button">
          <img src="/arrow-left.svg" alt="Voltar" />
          </button>
           </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h2>{episode.title}</h2>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>   
      </header>
      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { voice } = ctx.params;

  const { data } = await api.get(`/episodes/${voice}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: converDurationToTime(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //atualizar a cada 24 horas
  };
};
