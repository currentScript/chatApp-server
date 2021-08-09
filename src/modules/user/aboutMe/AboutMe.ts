import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class AboutMeResolver {
  @Mutation(() => Boolean)
  async editAboutMe(
    @Arg("aboutMe") aboutMe: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return false;
    }

    await User.update({ id: user.id }, { aboutMe });
    await User.update({ id: user.id }, { aboutMeUpdatedate: new Date() });

    return true;
  }

  @Mutation(() => Boolean)
  async removeAboutMe(@Ctx() ctx: MyContext): Promise<Boolean> {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return false;
    }

    await User.update({ id: user.id }, { aboutMe: undefined });
    await User.update({ id: user.id }, { aboutMeUpdatedate: undefined });

    return true;
  }
}
