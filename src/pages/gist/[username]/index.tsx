import { Button, Center, Container, List, Text } from "@mantine/core";
import { PlayIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import slug from "slug";
import { GIST_BASE_PATH } from "../../../../config";
import { GistCard } from "../../../components/GistCard/GistCard";
import GistForm from "../../../components/GistForm";
import { Gist } from "../../../hooks/useGistQuery";
import { useGistsQuery } from "../../../hooks/useGistsQuery";

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username as string;

  const gistsQuery = useGistsQuery(username);

  if (gistsQuery.isError) {
    return <div>Something unexpected happened!</div>;
  }

  const startRandomTypeTest = () => {
    const gists = gistsQuery.data;

    if (!gists) {
      return;
    }

    router.push(generateRandomGistPath(gists, username));
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
              <Text mr="md">Choose Random Gist</Text>
              <PlayIcon />
            </Button>
          </Center>
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
        </>
      )}
    </>
  );
};

function generateRandomGistPath(gists: Gist[], username: string) {
  const randomIndex = Math.floor(Math.random() * gists.length);
  const randomGist = gists[randomIndex]!;
  const gistFile = Object.values(randomGist.files)[0]!;
  const gistFileSlug = generateFilenameSlug(gistFile.filename);

  return `${GIST_BASE_PATH}/${username}/${randomGist.id}#${gistFileSlug}`;
}

export function generateFilenameSlug(filename: string): string {
  return `file-${slug(filename, { charmap: { ".": "-", _: "_" } })}`;
}

export default UserPage;
