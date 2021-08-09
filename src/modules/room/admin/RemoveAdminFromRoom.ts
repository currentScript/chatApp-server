import { User } from "../../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { RoomAdmin } from "../../../entity/RoomAdmin";

@Resolver()
export class RemoveAdminFromRoomResolver {
  @Mutation(() => Boolean)
  async removeAdminfromRoom(
    @Arg("roomId") roomId: number,
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    const userId = user?.id;

    const admin = ctx.req.session.userId;

    // is the executing user admin of the room?
    const valid = await RoomAdmin.find({
      where: {
        roomId,
        userId: admin,
      },
    });

    if (!valid[0]) {
      return false;
    }

    const isUserAdmin = await RoomAdmin.find({
      where: { roomId, userId },
    });

    if (!isUserAdmin[0]) {
      return false;
    }

    await RoomAdmin.delete({ roomId, userId });
    return true;
  }
}
