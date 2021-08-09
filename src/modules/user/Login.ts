import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import bcrypt from "bcryptjs";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (user.image) {
      user.image = `${ctx.req.headers.host}/imageProfile/${user.image}.jpg`;
    }

    // set cookie
    ctx.req.session.userId = user.id;

    return user;
  }
}
