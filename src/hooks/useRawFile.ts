import { useQuery } from "react-query";

export const fetchRawFile = async (url: string) => {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  if (response.ok && contentType?.includes("text/plain")) {
    return response.text();
  }

  throw new Error(`Failed to fetch with status error ${response.status}`);
};

export const useRawFile = (url: string) => {
  return useQuery(["file", url], () => fetchRawFile(url), {
    staleTime: Infinity,
  });
};
