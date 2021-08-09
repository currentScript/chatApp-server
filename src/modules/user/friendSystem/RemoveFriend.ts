import { Friends } from "../../../entity/Friends";
import { User } from "../../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class RemoveFriendResolver {
  @Mutation(() => Boolean)
  async removeFriend(
    @Ctx() ctx: MyContext,
    @Arg("friendId") friendId: number
  ): Promise<Boolean> {
    const userId = ctx.req.session.userId;
    const friend = await User.findOne({ where: { id: friendId } });

    const deleted = await Friends.delete({
      user: userId,
      friend,
    });

    if (deleted.affected === 0) {
      return false;
    }

    return true;
  }
}
