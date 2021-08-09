import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  messageContent: string;

  @Field((_type) => Date)
  @CreateDateColumn()
  date: Date;

  @Column()
  roomId: number;

  @Column()
  userId: number;

  // Relations
  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: "roomId" })
  room: Room;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: "userId" })
  user: User;
}

export interface MessagePayload {
  id: number;
  message?: string;
}
