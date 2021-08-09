import { Room } from "../../entity/Room";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LeaveRoomResolver {
  @Mutation(() => Boolean)
  async leaveRoom(
    @Arg("roomName") roomName: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const room = await Room.find({
      name: roomName,
    });

    console.log(ctx.req.session.userId);
    console.log(room);

    return room ? true : false;
  }
}
