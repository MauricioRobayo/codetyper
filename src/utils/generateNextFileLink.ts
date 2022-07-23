import { GistFile } from "../hooks/useGistQuery";
import { GistFileWithResult } from "../pages/gist/[username]/[id]";
import { generateFilenameSlug } from "./generateFilenameSlug";

export function generateNextFileLink(
  gistFilesWithResult: GistFileWithResult[],
  currentGistFile: GistFile
) {
  const currentIndex = gistFilesWithResult.findIndex(
    (gistFile) => gistFile.filename === currentGistFile?.filename
  );
  const nextIndex = (currentIndex + 1) % gistFilesWithResult.length;
  const nextFile = gistFilesWithResult[nextIndex]!;
  return generateFilenameSlug(nextFile.filename);
}
