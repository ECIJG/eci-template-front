import { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import fetchFn from "@/src/libs/fetchFn";

export const authOptions: AuthOptions = {
  providers: [
    AzureADProvider({
      //@ts-ignore
      clientId: process.env.AZURE_AD_CLIENT_ID,
      //@ts-ignore
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile user.Read email", prompt: "select_account" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        usuario: { label: "user", type: "text" },
        password: { label: "Password", type: "text" },
        rol: { label: "rol", type: "text" },
      },
      async authorize(credentials) {
        const response = await fetchFn(`/iniciar-sesion`, {
          method: "POST",
          body: {
            usuario: credentials?.usuario,
            password: credentials?.password,
            rol: credentials?.rol,
          },
        });
        if (response.code === 401) {
          throw new Error("auth");
        } else if (response.code === 409) {
          throw new Error("out-of-date");
        } else if (response.code === 400) {
          throw new Error("authStudent");
        } else if (response.code !== 200) {
          throw new Error("server");
        }
        return { ...response.data, email: response.data.correo_principal };
      },
    }),
  ],

  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 1 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login", // Error code passed in query string as ?error=
  },
};
