import {
  Button,
  Container,
  Divider,
  Group,
  List,
  Loader,
  Text,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { PlayIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { GistCard } from "../../../components/GistCard/GistCard";
import { GistForm } from "../../../components/GistForm";
import { useGistFilesQuery } from "../../../hooks/useGistFilesQuery";
import { Gist } from "../../../hooks/useGistQuery";
import { useGistsQuery } from "../../../hooks/useGistsQuery";
import { generateGistPath } from "../../../utils/generateGistPath";
import { getRandomGist } from "../../../utils/getRandomGist";

const UserPage = () => {
  const [randomGist, setRandomGist] = useState<Gist | null>(null);
  const router = useRouter();
  const username = router.query.username;

  const setNextRandomGist = (gists: Gist[]) => {
    setRandomGist(getRandomGist(gists));
  };

  useGistFilesQuery(randomGist);

  const gistsQuery = useGistsQuery(
    typeof username === "string" ? username : "",
    {
      onSuccess: setNextRandomGist,
    }
  );

  if (gistsQuery.isError) {
    return <div>Something unexpected happened!</div>;
  }

  return (
    <>
      {router.isReady && typeof username === "string" && (
        <Container>
          <Group align="flex-end" position="apart">
            <GistForm
              username={username}
              loading={gistsQuery.isLoading}
              showHeader
            />
            {randomGist ? (
              <Button
                component={NextLink}
                href={generateGistPath(randomGist, username)}
                variant="default"
                tabIndex={0}
              >
                <Text mr="md">Random Gist</Text>
                <PlayIcon />
              </Button>
            ) : (
              <Loader />
            )}
          </Group>
          <Divider my="xl" />
        </Container>
      )}
      {gistsQuery.isSuccess && (
        <Container>
          <List spacing="lg" listStyleType="none">
            {gistsQuery?.data.map(({ id, description, files }) => {
              return (
                <List.Item key={id}>
                  <GistCard
                    description={description}
                    files={files}
                    breadcrumbs={[
                      {
                        title: id,
                      },
                    ]}
                    path={`${username}/${id}`}
                  />
                </List.Item>
              );
            })}
          </List>
        </Container>
      )}
    </>
  );
};

export default UserPage;
