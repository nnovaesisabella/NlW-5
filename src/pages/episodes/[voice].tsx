import { GetStaticPaths, GetStaticProps } from "next";
import ptBR from "date-fns/locale/pt-BR";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import { converDurationToTime } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";

//tipagem dados que serão inseridos na página
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

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <button>
          <img src="/arrow-left.svg" alt="Voltar" />
        </button>
      </div>
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
