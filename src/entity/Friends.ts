import { ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Friends extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  friendId: number;

  // Relations
  @ManyToOne(() => User, (user) => user.friendUser, { primary: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => User, (user) => user.friend, { primary: true })
  @JoinColumn({ name: "friendId" })
  friend: User;
}
