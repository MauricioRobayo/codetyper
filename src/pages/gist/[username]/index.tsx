import {
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  List,
  Loader,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import slug from "slug";
import { GIST_BASE_PATH } from "../../../../config";
import { Gist } from "../../../hooks/useGist";
import { useGists } from "../../../hooks/useGists";

const UserPage = () => {
  const router = useRouter();
  const [gists, setGists] = useState<Gist[] | null>(null);
  const username = router.query.username as string;

  const gistsQuery = useGists(username, { onSuccess: setGists });

  if (gistsQuery.isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (gistsQuery.isError) {
    return <div>Something unexpected happened!</div>;
  }

  const startRandomTypeTest = () => {
    if (!gists) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * gists.length);
    const gistPath = `${GIST_BASE_PATH}/${username}/${gists[randomIndex]!.id}`;
    router.push(gistPath);
  };

  return (
    <>
      <Center my="lg">
        <Button onClick={startRandomTypeTest}>
          Start Typing a Random Gist
        </Button>
      </Center>
      <Container>
        <List spacing="lg" listStyleType="none">
          {gists?.map(({ id, description, files }) => {
            return (
              <List.Item key={id}>
                <Card>
                  {description ? (
                    <Title
                      order={2}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      mb="sm"
                    >
                      <Link
                        href={`${GIST_BASE_PATH}${username}/${id}`}
                        passHref
                      >
                        <Anchor variant="text">{description}</Anchor>
                      </Link>
                    </Title>
                  ) : null}
                  <Group spacing="xs">
                    {Object.values(files).map(({ raw_url, filename }) => (
                      <Link
                        key={raw_url}
                        href={`/${username}/${id}#${generateFilenameSlug(
                          filename
                        )}`}
                        passHref
                      >
                        <Anchor variant="text">
                          <Badge
                            size="sm"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            {filename}
                          </Badge>
                        </Anchor>
                      </Link>
                    ))}
                  </Group>
                </Card>
              </List.Item>
            );
          })}
        </List>
      </Container>
    </>
  );
};

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}

export default UserPage;
