import { Ctx, Query, Resolver } from "type-graphql";
import { In } from "typeorm";
import { MyContext } from "../../types/MyContext";
import { RoomUser } from "../../entity/RoomUser";
import { User } from "../../entity/User";
import { Room } from "../../entity/Room";

@Resolver()
export class LoadAllRoomsResolver {
  @Query(() => [Room], { nullable: true, description: "display all roomnames" })
  async loadAllRooms(@Ctx() ctx: MyContext): Promise<Room[] | null> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return null;
    }

    const roomsData = await RoomUser.find({
      where: { userId: ctx.req.session.userId },
    });
    const roomIds = roomsData.map((room) => {
      return room.roomId;
    });
    const rooms = await Room.find({ where: { id: In(roomIds) } });

    rooms.map((room) => {
      if (room.image) {
        room.image = `${ctx.req.headers.host}/imageRoom/${room.image}.jpg`;
      }
    });

    return rooms;
  }
}
