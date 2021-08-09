import { Request } from "express";

export interface MyContext {
  req: Request & {
    session: {
      userId?: any;
    };
  };
  res: Response & {
    clearCookie(cookie: string): () => Boolean;
  };
}
