import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import slug from "slug";
import { Button } from "../../components/Button";
import { Gist } from "../../hooks/useGist";
import { useGists } from "../../hooks/useGists";

const UserPage = () => {
  const router = useRouter();
  const [gists, setGists] = useState<Gist[] | null>(null);
  const username = router.query.username as string;

  const gistsQuery = useGists(username, { onSuccess: setGists });

  if (gistsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (gistsQuery.isError) {
    return <div>Something unexpected happened!</div>;
  }

  const startRandomTypeTest = () => {
    if (!gists) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * gists.length);
    const gistPath = `/${username}/${gists[randomIndex]!.id}`;
    router.push(gistPath);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Button onClick={startRandomTypeTest}>
            Start Random Typing Test
          </Button>
        </div>
      </div>
      <ul>
        {gists?.map(({ id, description, files }) => (
          <li key={id}>
            <Link href={`/${username}/${id}`}>{description}</Link>
            <ul>
              {Object.values(files).map(({ raw_url, filename }) => (
                <li key={raw_url}>
                  <Link
                    href={`/${username}/${id}#${generateFilenameSlug(
                      filename
                    )}`}
                  >
                    {filename}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}

export default UserPage;
