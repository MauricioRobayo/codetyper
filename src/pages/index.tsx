import type { NextPage } from "next";
import Head from "next/head";
import GistForm from "../components/GistForm";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gist Typer</title>
        <meta name="description" content="Code Typer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GistForm />
    </>
  );
};

export default Home;
