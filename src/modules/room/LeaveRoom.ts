import { Room } from "../../entity/Room";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { RoomUser } from "../../entity/RoomUser";
import { RoomAdmin } from "../../entity/RoomAdmin";

@Resolver()
export class LeaveRoomResolver {
  @Mutation(() => Boolean)
  async leaveRoom(
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const room = await Room.findOne({
      id: roomId,
    });

    if (!room) return false;

    const valid = await RoomUser.findOne({
      where: {
        userId: ctx.req.session.userId,
        roomId: room.id,
      },
    });

    if (!valid) return false;

    await RoomUser.delete({
      userId: ctx.req.session.userId,
      roomId: room.id,
    });

    await RoomAdmin.delete({
      userId: ctx.req.session.userId,
      roomId: room.id,
    });

    return true;
  }
}
