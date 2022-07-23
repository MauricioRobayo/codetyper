import { Gist } from "../hooks/useGistQuery";

export function getRandomGist(
  gists: Gist[],
  excludeGistIds: string[] = []
): Gist {
  return getRandomGistHelper(gists, excludeGistIds);
}

function getRandomGistHelper(
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
    return getRandomGistHelper(gists, excludeGistIds, depth + 1);
  }

  return randomGist;
}
