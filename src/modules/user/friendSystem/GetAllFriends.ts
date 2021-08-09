import { Friends } from "../../../entity/Friends";
import { User } from "../../../entity/User";
import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { In } from "typeorm";

@Resolver()
export class GetAllFriendsResolver {
  @Query(() => [User])
  async getAllFriends(@Ctx() ctx: MyContext): Promise<User[]> {
    const userId = ctx.req.session.userId;

    const friendsArr = await Friends.find({ where: { user: userId } });
    const friendsIds = friendsArr.map((friend) => {
      return friend.friendId;
    });

    const friends = await User.find({ id: In(friendsIds) });

    return friends;
  }
}
