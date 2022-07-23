import { GIST_BASE_PATH } from "../../config";
import { Gist } from "../hooks/useGistQuery";
import { generateFilenameSlug } from "./generateFilenameSlug";

export function generateRandomGistPath(
  gists: Gist[],
  username: string,
  excludeGistIds: string[] = []
) {
  const randomGist = getRandomGist(gists, excludeGistIds);
  const gistFile = Object.values(randomGist.files)[0]!;
  const gistFileSlug = generateFilenameSlug(gistFile.filename);

  return `${GIST_BASE_PATH}/${username}/${randomGist.id}#${gistFileSlug}`;
}

function getRandomGist(
  gists: Gist[],
  excludeGistIds: string[] = [],
  depth = 0
): Gist {
  const randomIndex = Math.floor(Math.random() * gists.length);
  const randomGist = gists[randomIndex]!;

  if (depth === 5) {
    return randomGist;
  }

  if (excludeGistIds.includes(randomGist.id)) {
    return getRandomGist(gists, excludeGistIds, depth + 1);
  }

  return randomGist;
}
