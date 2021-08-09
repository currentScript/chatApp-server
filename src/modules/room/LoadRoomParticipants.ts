import { RoomUser } from "../../entity/RoomUser";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
// import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { In } from "typeorm";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class LoadRoomParticipantsResolver {
  @Query(() => [User], { nullable: true })
  async loadRoomParticipants(
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<User[] | null> {
    const valid = await RoomUser.find({
      where: {
        userId: ctx.req.session.userId,
        roomId,
      },
    });

    if (!valid[0]) {
      return null;
    }

    const participantsArr = await RoomUser.find({ where: { roomId } });
    const participantsIds = participantsArr.map((user) => {
      return user.userId;
    });

    const participantsObjArr = await User.find({ id: In(participantsIds) });

    return participantsObjArr;
  }
}
