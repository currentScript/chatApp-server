import { User } from "../../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { RoomAdmin } from "../../../entity/RoomAdmin";
import { RoomUser } from "../../../entity/RoomUser";

@Resolver()
export class AddAdminToRoomResolver {
  @Mutation(() => Boolean)
  async addAdminToRoom(
    @Arg("roomId") roomId: number,
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    const userId = user?.id;

    const owner = ctx.req.session.userId;

    const valid = await RoomAdmin.findOne({
      where: {
        roomId,
        userId: owner,
      },
    });

    if (!valid) {
      return false;
    }

    const isUserInRoom = await RoomUser.findOne({
      where: {
        userId,
      },
    });

    if (!isUserInRoom) {
      return false;
    }

    const isUserAlreadAdmin = await RoomAdmin.findOne({
      where: { roomId, userId },
    });

    if (isUserAlreadAdmin) {
      return false;
    }

    await RoomAdmin.create({ roomId, userId }).save();
    return true;
  }
}
