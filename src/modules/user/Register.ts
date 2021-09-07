import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { MyContext } from "src/types/MyContext";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User, { nullable: true })
  async register(
    @Arg("data") { email, username, password }: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const isEmailAlreadyInUse = await User.findOne({ email });
    if (isEmailAlreadyInUse) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const tag = Math.floor(1000 + Math.random() * 9000);

    const tagAlreadyInUseWithUsername = await User.findOne({
      username: username,
      tag,
    });

    if (tagAlreadyInUseWithUsername) return null;

    const user = await User.create({
      username,
      tag,
      email,
      password: hashedPassword,
    }).save();

    // Auto-Login
    ctx.req.session.userId = user.id;

    return user;
  }
}
