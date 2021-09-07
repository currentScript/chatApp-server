import { Field, ObjectType } from "type-graphql";
import { Message } from "../Message";
import { Room } from "../Room";
import { User } from "../User";

@ObjectType()
export class LoadRoom {
  @Field()
  room: Room;

  @Field(() => [User])
  participants: User[];

  @Field(() => [Message])
  messages: Message[];

  @Field()
  id: number;
}
