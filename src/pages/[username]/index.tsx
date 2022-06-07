import { Anchor, Button, List, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import slug from "slug";
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
        <Button onClick={startRandomTypeTest}>Start Random Typing Test</Button>
      </div>
      <List spacing="lg">
        {gists?.map(({ id, description, files }) => (
          <List.Item key={id}>
            <Link href={`/${username}/${id}`} passHref>
              <Anchor variant="text">{description}</Anchor>
            </Link>
            <List withPadding>
              {Object.values(files).map(({ raw_url, filename }) => (
                <List.Item key={raw_url}>
                  <Link
                    href={`/${username}/${id}#${generateFilenameSlug(
                      filename
                    )}`}
                    passHref
                  >
                    <Anchor variant="text">{filename}</Anchor>
                  </Link>
                </List.Item>
              ))}
            </List>
          </List.Item>
        ))}
      </List>
    </>
  );
};

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}

export default UserPage;
