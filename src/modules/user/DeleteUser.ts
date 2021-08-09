import { MyContext } from "src/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";

@Resolver()
export class DeleteUserResolver {
  @Mutation(() => Boolean)
  async deleteUser(@Ctx() ctx: MyContext): Promise<Boolean> {
    const userId = ctx.req.session.userId;
    const user = await User.delete(userId);

    if (user.affected === 0) {
      return false;
    }

    return true;
  }
}
