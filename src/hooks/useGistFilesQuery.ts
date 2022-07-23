import { Gist } from "./useGistQuery";
import { useRawFilesQuery } from "./useRawFilesQuery";

export function useGistFilesQuery(gist: Gist | null | undefined) {
  return useRawFilesQuery(
    Object.values(gist?.files ?? {}).map(({ raw_url }) => raw_url)
  );
}
