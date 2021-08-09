import { MyContext } from "src/types/MyContext";
import { Resolver, Ctx, Mutation } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, rej) => {
      ctx.req.session.destroy((err) => {
        if (err) {
          console.log(err);
          rej(false);
        }

        ctx.res.clearCookie!("qid");
        res(true);
      });
    });
  }
}
