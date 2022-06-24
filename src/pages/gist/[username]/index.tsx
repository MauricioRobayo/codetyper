import {
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  List,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import slug from "slug";
import { PlayIcon } from "@radix-ui/react-icons";
import { GIST_BASE_PATH } from "../../../../config";
import GistForm from "../../../components/GistForm";
import { Gist } from "../../../hooks/useGistQuery";
import { useGistsQuery } from "../../../hooks/useGistsQuery";

const UserPage = () => {
  const router = useRouter();
  const [gists, setGists] = useState<Gist[] | null>(null);
  const username = router.query.username as string;

  const gistsQuery = useGistsQuery(username, { onSuccess: setGists });

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
      {router.isReady && (
        <GistForm username={username} loading={gistsQuery.isLoading} />
      )}
      {gistsQuery.isSuccess && (
        <>
          <Center mb="md" mt="xl">
            <Button onClick={startRandomTypeTest} variant="default">
              <Text mr="md">Start Typing a Random Gist</Text>
              <PlayIcon />
            </Button>
          </Center>
          <Container>
            <List spacing="lg" listStyleType="none">
              {gists?.map(({ id, description, files }) => {
                return (
                  <List.Item key={id}>
                    <Card>
                      <Link
                        href={`${GIST_BASE_PATH}/${username}/${id}`}
                        passHref
                      >
                        <Anchor variant="text">
                          <Title
                            order={2}
                            mb="sm"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {description || id}
                          </Title>
                        </Anchor>
                      </Link>
                      <Group spacing="xs">
                        {Object.values(files).map(({ raw_url, filename }) => (
                          <Link
                            key={raw_url}
                            href={`${GIST_BASE_PATH}/${username}/${id}#${generateFilenameSlug(
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
      )}
    </>
  );
};

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}

export default UserPage;
