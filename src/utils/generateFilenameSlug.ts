import slug from "slug";

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}
