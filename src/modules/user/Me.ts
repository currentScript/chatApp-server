import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true, description: "load user profile" })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return null;
    }

    let profileImgUrl;
    if (user.image) {
      profileImgUrl = `${ctx.req.headers.host}/imageProfile/${user.image}.jpg`;
      user.image = profileImgUrl;
    }

    return user;
  }
}
