interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  return (
    <>
      <header>Code Typer</header>
      {children}
      <footer>Code Typer</footer>
    </>
  );
}
