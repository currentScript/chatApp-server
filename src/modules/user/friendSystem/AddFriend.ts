import { Friends } from "../../../entity/Friends";
import { User } from "../../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";

@Resolver()
export class AddFriendResolver {
  @Mutation(() => Boolean)
  async addFriend(
    @Ctx() ctx: MyContext,
    @Arg("friendId") friendId: number
  ): Promise<Boolean> {
    const userId = ctx.req.session.userId;
    const friend = await User.findOne({ where: { id: friendId } });

    const isAlreadeFriends = await Friends.find({
      where: {
        user: userId,
        friend,
      },
    });

    if (isAlreadeFriends[0]) {
      return false;
    }

    await Friends.create({
      user: userId,
      friend,
    }).save();

    return true;
  }
}
