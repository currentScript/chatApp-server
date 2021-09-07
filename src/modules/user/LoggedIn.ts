import { Ctx, Query, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoggedInResolver {
  @Query(() => Boolean)
  async loggedIn(@Ctx() ctx: MyContext): Promise<boolean> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });

    if (!user) {
      return false;
    }

    return true;
  }
}
