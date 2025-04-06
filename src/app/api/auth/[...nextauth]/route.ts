import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt"; // Import JWT type

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      user_type?: string; // Ensure user_type is included
    } & DefaultSession["user"];
  }
}

// Explicitly define JWT type to avoid "unknown" errors
interface ExtendedJWT extends JWT {
  id?: string;
  email?: string;
  user_type?: string; // Ensure user_type is recognized
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
    async jwt({ token, account, profile }): Promise<ExtendedJWT> {
      if (profile) {
        token.id = profile.sub as string;
        token.email = profile.email ?? undefined; // Convert null to undefined

        try {
          // Fetch user type from Django backend
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${token.email}`);
          if (res.ok) {
            const userData = await res.json();
            token.user_type = typeof userData.user_type === "string" ? userData.user_type : undefined;
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      }
      return {
        ...token,
        email: token.email ?? undefined, // Convert null to undefined
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email ?? undefined, // Convert null to undefined
          user_type: typeof token.user_type === "string" ? token.user_type : undefined, // Ensure type safety
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
