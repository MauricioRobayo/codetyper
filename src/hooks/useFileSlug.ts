import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { generateFilenameSlug } from "../pages/[username]";
import { GistFile } from "./useGist";

export const useCurrentGistFile = (
  gistFiles: GistFile[] | null,
  currentFileIndex: number
) => {
  const router = useRouter();
  const [fileSlug, setFileSlug] = useState<string | null>(null);
  const [autoAdvanceFile, setAutoAdvanceFile] = useState<boolean | null>(null);
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

    if (isReady && autoAdvanceFile === null) {
      setAutoAdvanceFile(!fileSlugFromHash);
    }

    if (isReady && fileSlugFromHash) {
      setFileSlug(fileSlugFromHash);
      return;
    }

    const currentGistFile = gistFiles?.[currentFileIndex];

    if (isReady && currentGistFile) {
      if (currentGistFile) {
        const hash = generateFilenameSlug(currentGistFile.filename);
        setFileSlug(hash);
        router.push({ hash });
      }
    }
  }, [asPath, autoAdvanceFile, currentFileIndex, gistFiles, isReady, router]);

  return { state: { gistFile, autoAdvanceFile }, setFileSlug };
};
