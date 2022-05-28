import type { NextPage } from "next";
import Head from "next/head";
import GistForm from "../components/GistForm";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Code Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>code typer</h1>
      </header>
      <main>
        <GistForm />
      </main>
    </div>
  );
};

export default Home;
