import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
// import supabase from "@/lib/supabase";
// import { Auth } from "@supabase/ui";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Auth.UserContextProvider supabaseClient={supabase}> */}
      <Component {...pageProps} />
      {/* </Auth.UserContextProvider> */}
    </QueryClientProvider>
  );
}
