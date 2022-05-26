import axios from "axios";
import { useQuery } from "react-query";

export const useRawFile = (url: string) => {
  const fetchRawFile = async (url: string) => {
    const { data } = await axios.get<string>(url);
    return data;
  };

  return useQuery(["rawFile", url], () => fetchRawFile(url), {
    enabled: url !== "",
  });
};
