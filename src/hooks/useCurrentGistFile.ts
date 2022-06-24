import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { generateFilenameSlug } from "../pages/gist/[username]";
import { GistFile } from "./useGistQuery";

export const useCurrentGistFile = (gistFiles: GistFile[] | null) => {
  const router = useRouter();
  const [fileSlug, setFileSlug] = useState<string | null>(null);
  const { asPath, isReady } = router;

  const gistFile = useMemo(() => {
    if (fileSlug === null) {
      return;
    }

    return gistFiles
      ?.map(({ filename }, index) => ({ filename, index }))
      .find((gistFile) => generateFilenameSlug(gistFile.filename) === fileSlug);
  }, [gistFiles, fileSlug]);

  useEffect(() => {
    const [, fileSlugFromHash] = asPath.split("#");

    if (isReady && fileSlugFromHash) {
      setFileSlug(fileSlugFromHash);
      return;
    }

    const currentGistFile = gistFiles?.[currentFileIndex];

    if (isReady && currentGistFile) {
      if (currentGistFile) {
        const hash = generateFilenameSlug(currentGistFile.filename);
        setFileSlug(hash);
        router.replace({ hash });
      }
    }
  }, [asPath, currentFileIndex, gistFiles, isReady, router]);

  return { gistFile, setFileSlug };
};
