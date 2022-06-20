import { useQuery } from "react-query";
import axios from "axios";

export const fetchRawFile = async (url: string) => {
  const response = await axios.get<string>(url);
  const contentType = response.headers["content-type"];
  if (!contentType?.includes("text/plain")) {
    throw new Error(`Failed to fetch with status error ${response.status}`);
  }

  return response.data;
};

export const useRawFile = (url: string) => {
  return useQuery(["file", url], () => fetchRawFile(url), {
    enabled: !!url,
    staleTime: Infinity,
  });
};
