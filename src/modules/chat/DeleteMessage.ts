import { Message } from "../../entity/Message";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class DeleteMessageResolver {
  @Mutation(() => Boolean)
  async deleteMessage(
    @Arg("messageId") messageId: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const userId = ctx.req.session.userId;
    const message = await Message.delete(messageId, userId);

    console.log(message);

    if (message.affected === 0) {
      return false;
    }
    return true;
  }
}
