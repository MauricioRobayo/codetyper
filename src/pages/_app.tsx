import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { MantineProvider } from "@mantine/core";
import { Layout } from "../components/Layout";
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  usePagesViews();

  return (
    <>
      <GoogleAnalytics />
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
