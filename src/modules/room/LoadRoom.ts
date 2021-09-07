import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { In } from "typeorm";
import { Message } from "../../entity/Message";
import { MyContext } from "../../types/MyContext";
import { RoomUser } from "../../entity/RoomUser";
import { User } from "../../entity/User";
import { LoadRoom } from "../../entity/graphql/LoadRoom";
import { Room } from "../../entity/Room";
import { RoomAdmin } from "../../entity/RoomAdmin";

@Resolver()
export class LoadRoomResolver {
  @Query(() => LoadRoom, { nullable: true })
  async loadRoom(
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<LoadRoom | null> {
    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) {
      return null;
    }

    const userId = ctx.req.session.userId;
    const valid = await RoomUser.findOne({ where: { roomId, userId } });

    if (!valid) {
      return null;
    }

    if (room.image) {
      room.image = `${ctx.req.headers.host}/imageRoom/${room.image}.jpg`;
    }

    // ********************************* Admins *********************************
    const adminArr = await RoomAdmin.find({ where: { roomId } });
    const adminIds = adminArr.map((admin) => {
      return admin.userId;
    });
    const admins = await User.find({ id: In(adminIds) });
    room.admins = admins;
    // **************************************************************************

    // ****************************** Participants ******************************
    const participantsArr = await RoomUser.find({ where: { roomId } });
    const participantsIds = participantsArr.map((user) => {
      return user.userId;
    });
    const participants = await User.find({ id: In(participantsIds) });

    participants.map((participant) => {
      if (participant.image) {
        participant.image = `${ctx.req.headers.host}/imageProfile/${participant.image}.jpg`;
      }
    });
    // **************************************************************************

    // ******************************** Messages ********************************
    const messages = await Message.find({ where: { roomId: roomId } });
    const messagesIds = messages.map((message) => {
      return message.userId;
    });
    const messageAuthors = await User.find({ id: In(messagesIds) });
    messageAuthors.map((user) => {
      if (user.image) {
        user.image = `${ctx.req.headers.host}/imageProfile/${user.image}.jpg`;
      }
    });
    messages.map((message) => {
      message.user = messageAuthors.find((user) => user.id === message.userId)!;
    });
    // **************************************************************************

    const roomReturnObject: LoadRoom = {
      room,
      participants,
      messages,
      id: room.id,
    };

    return roomReturnObject;
  }
}
