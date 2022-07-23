import { GIST_BASE_PATH } from "../../config";
import { Gist } from "../hooks/useGistQuery";
import { generateFilenameSlug } from "./generateFilenameSlug";

export function generateGistPath(gist: Gist, username: string) {
  const [gistFile] = Object.values(gist.files);

  if (!gistFile) {
    throw new Error(`No gist file for gist '${gist.id}'!`);
  }

  const gistFileSlug = generateFilenameSlug(gistFile.filename);

  return `${GIST_BASE_PATH}/${username}/${gist.id}#${gistFileSlug}`;
}
