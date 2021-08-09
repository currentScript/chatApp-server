import { Room } from "../../entity/Room";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { RoomUser } from "../../entity/RoomUser";
import { RoomAdmin } from "../../entity/RoomAdmin";
import { User } from "../../entity/User";

@Resolver()
export class CreateRoomResolver {
  @Mutation(() => Boolean)
  async createRoom(
    @Arg("name") name: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const owner = await User.findOne({ where: { id: ctx.req.session.userId } });
    const room = await Room.create({
      name,
      owner,
    }).save();

    if (!room) {
      return false;
    }

    const roomUser = await RoomUser.create({
      roomId: room.id,
      userId: ctx.req.session.userId,
    }).save();

    const roomAdmin = await RoomAdmin.create({
      roomId: room.id,
      userId: ctx.req.session.userId,
    }).save();

    if (!roomUser || !roomAdmin) {
      return false;
    }

    return true;
  }
}
