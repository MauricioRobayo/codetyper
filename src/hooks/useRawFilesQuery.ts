import { useQueries } from "react-query";
import { fetchRawFile } from "./useRawFileQuery";

export interface RawFileData {
  url: string;
  text: string;
}

interface QuerySuccess {
  errors: undefined;
  isError: false;
  isLoading: false;
  isFetching: false;
  isSuccess: true;
  isIdle: false;
  data: RawFileData[];
}

interface QueryError {
  errors: unknown[];
  isError: true;
  isLoading: false;
  isFetching: false;
  isSuccess: false;
  isIdle: false;
  data: undefined;
}

interface QueryResult {
  errors: undefined;
  isError: false;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: false;
  isIdle: boolean;
  data: undefined;
}

export const useRawFilesQuery = (
  urls: string[]
): QuerySuccess | QueryError | QueryResult => {
  const queries = useQueries(
    urls.map((url) => {
      return {
        queryKey: ["file", url],
        queryFn: async () => {
          const text = await fetchRawFile(url);
          return {
            url: text,
          };
        },
        enabled: urls.length > 0,
      };
    })
  );

  const isError = queries.some(({ isError }) => isError);
  if (isError) {
    const errors = queries.map(({ error }) => error);
    const result: QueryError = {
      errors,
      isSuccess: false,
      isLoading: false,
      isFetching: false,
      isError,
      isIdle: false,
      data: undefined,
    };
    return result;
  }

  const isSuccess = queries.every(({ isSuccess }) => isSuccess);
  if (isSuccess) {
    const data = queries
      .map(({ data }) => data)
      .filter((data): data is RawFileData => !!data);
    const result: QuerySuccess = {
      errors: undefined,
      isSuccess,
      isLoading: false,
      isFetching: false,
      isError: false,
      isIdle: false,
      data,
    };
    return result;
  }

  return {
    data: undefined,
    errors: undefined,
    isError,
    isSuccess,
    isLoading: queries.some(({ isLoading }) => isLoading),
    isFetching: queries.some(({ isFetching }) => isFetching),
    isIdle: queries.every(({ isIdle }) => isIdle),
  };
};
