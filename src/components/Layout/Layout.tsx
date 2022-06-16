import { Anchor, AppShell, Center, Footer, Header, Title } from "@mantine/core";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppShell
        header={
          <Header height="auto" p="md" sx={{ backgroundColor: "transparent" }}>
            <Link href="/" passHref>
              <Anchor>
                <Title>Code Typer</Title>
              </Anchor>
            </Link>
          </Header>
        }
        footer={
          <Footer fixed height="auto" p="md">
            <Center>
              <div>
                This is an{" "}
                <Anchor href="https://github.com/MauricioRobayo/code-typer">
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
