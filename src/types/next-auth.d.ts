import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
    username?: string;
  }

  interface Session {
    user: {
      _id?: string;
      isAcceptingMessages?: boolean;
      isVerified?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

//another way to declare modeul
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
