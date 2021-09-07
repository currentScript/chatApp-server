import { Room } from "../../entity/Room";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";
import { RoomAdmin } from "../../entity/RoomAdmin";
import { RoomUser } from "../../entity/RoomUser";
import { Message } from "../../entity/Message";

@Resolver()
export class DeleteRoomResolver {
  @Mutation(() => Boolean)
  async deleteRoom(
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return false;
    }

    const room = await Room.findOne({
      where: {
        id: roomId,
        owner: user.id,
      },
    });

    if (!room) {
      return false;
    }

    await RoomAdmin.delete({ roomId });
    await RoomUser.delete({ roomId });
    await Message.delete({ room });
    await Room.delete({ id: roomId });

    return true;
  }
}
