import {
  Anchor,
  AppShell,
  Center,
  Footer,
  Header,
  Title,
  Text,
  MantineTheme,
  CSSObject,
} from "@mantine/core";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  const sx: CSSObject = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const styles = {
    body: {
      flex: "1",
    },
  };

  return (
    <>
      <AppShell
        sx={sx}
        styles={styles}
        header={
          <Header height="auto" p="md">
            <Link href="/" passHref>
              <Anchor>
                <Title>Code Typer</Title>
              </Anchor>
            </Link>
          </Header>
        }
        footer={
          <Footer height="auto" p="md">
            <Center>
              <div>
                This is an{" "}
                <Anchor href="https://github.com/MauricioRobayo/codetyper">
                  open source
                </Anchor>{" "}
                project
              </div>
            </Center>
          </Footer>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
