import { RoomUser } from "../../entity/RoomUser";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class AddUserToRoomResolver {
  @Mutation(() => Boolean)
  async addUserToRoom(
    @Arg("roomId") roomId: number,
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    // is the executing user in the room?
    const valid = await RoomUser.find({
      where: {
        userId: ctx.req.session.userId,
        roomId,
      },
    });

    if (!valid) {
      return false;
    }

    const user = await User.find({ where: { email } });
    const userId = user[0].id;

    const isUserAlreadInRoom = await RoomUser.find({
      where: { roomId, userId },
    });

    if (isUserAlreadInRoom[0]) {
      return false;
    }

    await RoomUser.create({ roomId, userId }).save();
    return true;
  }
}
