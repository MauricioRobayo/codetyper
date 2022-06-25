import { useQuery } from "react-query";
import axios from "axios";

export interface GistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  content: string;
}
export interface Gist {
  id: string;
  description: string;
  files: { [filename: string]: GistFile };
}

interface GistQueryOptions {
  onSuccess: (gist: Gist) => void;
}
export const useGistQuery = (gistId: string, options?: GistQueryOptions) => {
  const fetchGist = async (gistId: string) => {
    const { data } = await axios.get<Gist>(
      `https://api.github.com/gists/${gistId}`
    );
    return data;
  };
  return useQuery(["gist", gistId], () => fetchGist(gistId), {
    enabled: gistId !== "",
    onSuccess: options?.onSuccess,
  });
};
