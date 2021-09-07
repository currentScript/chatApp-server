import { RoomUser } from "../../entity/RoomUser";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { RoomAdmin } from "../../entity/RoomAdmin";

@Resolver()
export class RemoveUserFromRoomResolver {
  @Mutation(() => Boolean)
  async removeUserFromRoom(
    @Arg("roomId") roomId: number,
    @Arg("email") email: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const valid = await RoomUser.findOne({
      where: { userId: ctx.req.session.userId, roomId },
    });

    if (!valid) {
      return false;
    }

    const user = await User.findOne({ email });
    const userId = user?.id;

    const removedRoomUser = await RoomUser.delete({ roomId, userId });

    if (removedRoomUser.affected === 0) {
      return false;
    }

    await RoomAdmin.delete({
      roomId,
      userId,
    });

    return true;
  }
}
