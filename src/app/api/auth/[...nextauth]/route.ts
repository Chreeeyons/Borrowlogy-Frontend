import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt"; // Import JWT type

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      account?: any; // Store account information
      name?: string | null; // Ensure name can be null
      email?: string | null;
      user_type?: string; // Ensure user_type is included
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (profile) {

        try {
          // Fetch user type from Django backend
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/user/by_email/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: token.email }),
            }
          );
          if (res.ok) {
            const userData = await res.json();
            if (typeof userData.user_type === "string") {
              token.user_type = userData.user_type;
              token.name = userData.name; // Convert null to undefined
              token.id = userData.id; // Ensure ID is set from user data
              token.email = userData.email ?? undefined; // Convert null to undefined
              token.account = userData; // Store account information
            } else {
              throw new Error("User type missing");
            }
          } else {
            token = {};
            throw new Error("User not found in database");
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
          // Optionally, set a flag or property on the token to indicate error
          token.user_type = undefined;
        }
      }
      return {
        ...token,
        email: token.email ?? undefined,
      };
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user = {
          id: token.id as string,
          account: token.account ?? undefined, // Store account information
          name: token.name ?? undefined, // Ensure name can be null
          email: token.email ?? undefined, // Convert null to undefined
          user_type:
            typeof token.user_type === "string" ? token.user_type : undefined, // Ensure type safety
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true, // Enable debug mode for troubleshooting
});

export { handler as GET, handler as POST };
