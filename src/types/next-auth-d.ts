import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      email: string;
      image: string;
      name: string;
      documento: string;
      nombre: string;
      programa: string;
      area: string;
    };
  }
}
