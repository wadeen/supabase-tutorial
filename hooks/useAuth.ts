import { useRouter } from "next/router";

import supabase from "@/lib/supabasetjs";

const useAuth = () => {
  const router = useRouter();

  const onSignIn = async (email: string, password: string) => {
    try {
      // @ts-ignore
      const { data, error: signInError } = await supabase.auth.signIn({ email, password });
      if (signInError) throw signInError;

      console.log("data: ", data);

      return data;
    } catch (error) {
      // alert("エラーが発生しました");
      console.error(error);
    }

    // console.log("data: ", data);
  };

  const onGithubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    // supabase.auth.signIn({ provider: "github" });

    if (error) throw error;

    return data;
  };

  return {
    onGithubLogin,
    onSignIn,
  };
};

export default useAuth;
