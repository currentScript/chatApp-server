import { RoomUser } from "../../entity/RoomUser";
import { User } from "../../entity/User";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { MyContext } from "src/types/MyContext";

@ObjectType()
class Response {
  @Field()
  message: string;
  @Field()
  statusCode: number;
}

const responses = {
  NOT_PERMITTED: {
    message: "not permitted",
    statusCode: 401,
  },
  USER_NOT_FOUND: {
    message: "user not found",
    statusCode: 404,
  },
  USER_ALREADY_ADDED: {
    message: "user already added",
    statusCode: 406,
  },
  USER_ADDED: {
    message: "user added",
    statusCode: 200,
  },
};

@Resolver()
export class AddUserToRoomResolver {
  @Mutation(() => Response)
  async addUserToRoom(
    @Arg("roomId") roomId: number,
    @Arg("usernameTag") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Response> {
    const valid = await RoomUser.findOne({
      where: {
        userId: ctx.req.session.userId,
        roomId,
      },
    });

    if (!valid) {
      return responses.NOT_PERMITTED;
    }

    const tag = username.split("#");

    const user = await User.findOne({
      where: { username: tag[0], tag: tag[1] },
    });

    if (!user) {
      return responses.USER_NOT_FOUND;
    }

    const userId = user?.id;

    const isUserAlreadInRoom = await RoomUser.findOne({
      where: { roomId, userId },
    });

    if (isUserAlreadInRoom) {
      return responses.USER_ALREADY_ADDED;
    }

    await RoomUser.create({ roomId, userId }).save();
    return responses.USER_ADDED;
  }
}
