import { Field, ID, ObjectType, Root } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Friends } from "./Friends";
import { Message } from "./Message";
import { Room } from "./Room";
import { RoomAdmin } from "./RoomAdmin";
import { RoomUser } from "./RoomUser";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  tag: number;

  @Field()
  usernameTag(@Root() parent: User): string {
    return `${parent.username}#${parent.tag}`;
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  aboutMe?: string;

  @Field((_type) => Date, { nullable: true })
  @Column({ nullable: true })
  aboutMeUpdatedate?: Date;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Column()
  password: string;

  @Field((_type) => Date)
  @CreateDateColumn()
  created: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image?: string;

  // Relations
  @OneToMany(() => Room, (room) => room.owner)
  roomOwner: Room[];

  @OneToMany(() => RoomUser, (roomUser) => roomUser.user)
  roomConnection: Promise<RoomUser[]>;

  @OneToMany(() => RoomAdmin, (roomAdmin) => roomAdmin.room)
  adminConnection: Promise<RoomAdmin[]>;

  @OneToMany(() => Friends, (friends) => friends.user)
  friendUser: Friends[];

  @OneToMany(() => Friends, (friends) => friends.friend)
  friend: Friends[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Promise<Message[]>;
}
