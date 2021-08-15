import { Field, InputType } from "type-graphql";
import { Length, IsEmail } from "class-validator";
// import { IsNotBlank } from "./IsNotBlank";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 20, {
    message: "username can't be empty or contain more than 20 characters",
  })
  // @IsNotBlank("username", { message: "username can't contain spaces" })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8)
  password: string;
}
