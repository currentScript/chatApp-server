import { PubSubEngine } from "graphql-subscriptions";
import { RoomUser } from "../../entity/RoomUser";
import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Message } from "../../entity/Message";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";
import { Room } from "../../entity/Room";

@Resolver()
export class MessageSubResolver {
  @Mutation(() => Boolean)
  async sendMessage(
    @PubSub() pubSub: PubSubEngine,
    @Arg("message") message: string,
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ) {
    const userId = ctx.req.session.userId;
    const roomUser = await RoomUser.find({ where: { roomId, userId } });
    const user = await User.findOne({ where: { id: userId } });
    const room = await Room.findOne({ where: { id: roomId } });
    const valid = roomUser[0] ? true : false;

    if (!valid) {
      return false;
    }

    let profileImgUrl;
    if (user?.image) {
      profileImgUrl = `${ctx.req.headers.host}/imageProfile/${user.image}.jpg`;
      console.log(profileImgUrl);
      user.image = profileImgUrl;
    }

    const messageObj = await Message.create({
      messageContent: message,
      room,
      user,
    }).save();

    await pubSub.publish("MESSAGES", messageObj);
    return true;
  }

  @Subscription(() => Message, {
    topics: "MESSAGES",
    nullable: true,
  })
  async messageSubscription(
    @Root() message: Message,
    @Arg("roomId") roomId: number,
    @Ctx() ctx: any
  ): Promise<Message | null> {
    const userId = ctx.connection.context.req.session.userId;
    const valid = await RoomUser.find({ where: { roomId, userId } });

    if (!valid[0]) {
      return null;
    }

    if (message.room.id == roomId) {
      return message;
    }

    return null;
  }
}
