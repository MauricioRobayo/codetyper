import { useQuery } from "react-query";
import axios from "axios";

interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  content: string;
}
interface Gist {
  files: { [filename: string]: GistFile };
}

export const useGist = (gistId: string) => {
  const fetchGist = async (gistId: string) => {
    const { data } = await axios.get<Gist>(
      `https://api.github.com/gists/${gistId}`
    );
    return data;
  };
  return useQuery(["gist", gistId], () => fetchGist(gistId), {
    enabled: gistId !== "",
  });
};
