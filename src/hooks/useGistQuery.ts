import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

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
  onSuccess?: (gist: Gist) => void;
}
export const useGistQuery = (
  gistId: string,
  { onSuccess }: GistQueryOptions = {}
) => {
  const fetchGist = async () => {
    const { data } = await axios.get<Gist>(
      `https://api.github.com/gists/${gistId}`
    );
    return data;
  };

  return useQuery(["gist", gistId], () => fetchGist(), {
    enabled: gistId !== "",
    onSuccess,
  });
};
