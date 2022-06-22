import { useQueries } from "react-query";
import { fetchRawFile } from "./useRawFileQuery";

type QuerySuccess = {
  errors: undefined;
  isError: false;
  isLoading: false;
  isFetching: false;
  isSuccess: true;
  data: string[];
};

type QueryError = {
  errors: unknown[];
  isError: true;
  isLoading: false;
  isFetching: false;
  isSuccess: false;
  data: undefined;
};

type QueryResult = {
  errors: undefined;
  isError: false;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: false;
  data: undefined;
};

export const useRawFilesQuery = (
  urls: string[]
): QuerySuccess | QueryError | QueryResult => {
  const queries = useQueries(
    urls.map((url) => {
      return {
        queryKey: ["file", url],
        queryFn: () => fetchRawFile(url),
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
      data: undefined,
    };
    return result;
  }

  const isSuccess = queries.every(({ isSuccess }) => isSuccess);
  if (isSuccess) {
    const data = queries.map(({ data }) => data).filter(isString);
    const result: QuerySuccess = {
      errors: undefined,
      isSuccess,
      isLoading: false,
      isFetching: false,
      isError: false,
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
  };
};

function isString(data: string | undefined): data is string {
  return typeof data === "string";
}
