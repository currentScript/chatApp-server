import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Message } from "./Message";
import { RoomAdmin } from "./RoomAdmin";
import { RoomUser } from "./RoomUser";
import { User } from "./User";

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((_type) => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Field(() => [User])
  admins: User[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  image?: string;

  @Field((_type) => Date)
  @CreateDateColumn()
  created: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.roomOwner)
  @Field(() => User)
  owner: User;

  @OneToMany(() => Message, (message) => message.room)
  @Field((_type) => Message)
  messages: Promise<Message[]>;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.room)
  userConnection: Promise<RoomUser[]>;

  @OneToMany(() => RoomAdmin, (roomAdmin) => roomAdmin.room)
  adminConnection: Promise<RoomAdmin[]>;
}
