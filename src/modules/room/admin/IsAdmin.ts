import { Room } from "../../../entity/Room";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "../../../types/MyContext";
import { RoomUser } from "../../../entity/RoomUser";
import { RoomAdmin } from "../../../entity/RoomAdmin";

@Resolver()
export class IsAdminResolver {
  @Query(() => Boolean)
  async isAdmin(
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const room = await Room.findOne({
      id: roomId,
    });

    if (!room) return false;

    const valid = await RoomUser.findOne({
      userId: ctx.req.session.userId,
      roomId: room.id,
    });

    if (!valid) return false;

    const isAdmin = await RoomAdmin.findOne({
      userId: ctx.req.session.userId,
      roomId: room.id,
    });

    if (!isAdmin) return false;

    return true;
  }
}
