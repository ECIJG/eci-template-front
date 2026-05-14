import NextAuth from "next-auth";
import { authOptions } from "./auth";

// Export the Next.js handler

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
