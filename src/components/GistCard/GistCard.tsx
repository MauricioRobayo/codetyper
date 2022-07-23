import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { GitHubLogoIcon, PlayIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { GIST_BASE_PATH } from "../../../config";
import { Gist } from "../../hooks/useGistQuery";
import { generateFilenameSlug } from "../../utils/generateFilenameSlug";

interface BreadcrumbItem {
  title: string;
  href?: string;
}
interface GistCardProps {
  description: string;
  files: Gist["files"];
  breadcrumbs: BreadcrumbItem[];
  path: string;
}
export function GistCard({
  description,
  files,
  breadcrumbs,
  path,
}: GistCardProps) {
  return (
    <Card>
      <Box mb="md">
        <Group position="apart">
          {breadcrumbs.length > 0 && (
            <Breadcrumbs>
              {breadcrumbs.map(({ title, href }) => {
                if (href) {
                  return (
                    <Link key={href} href={href} passHref>
                      <Anchor sx={{ maxWidth: "95%" }}>
                        <Text size="sm">{title}</Text>
                      </Anchor>
                    </Link>
                  );
                }
                return (
                  <Text key={title} size="sm">
                    {title}
                  </Text>
                );
              })}
            </Breadcrumbs>
          )}
          <Anchor
            href={`https://gist.github.com/${path}`}
            variant="text"
            title="Open on GitHub"
          >
            <GitHubLogoIcon />
          </Anchor>
        </Group>
        {description && (
          <Title
            order={2}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "95%",
            }}
          >
            {description}
          </Title>
        )}
      </Box>
      <Group spacing="xs">
        {Object.values(files).map(({ raw_url, filename }) => (
          <Link
            key={raw_url}
            href={`${GIST_BASE_PATH}/${path}#${generateFilenameSlug(filename)}`}
            passHref
          >
            <Button
              component="a"
              radius="xl"
              variant="light"
              rightIcon={<PlayIcon />}
              compact
            >
              {filename}
            </Button>
          </Link>
        ))}
      </Group>
    </Card>
  );
}
