import { ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@ObjectType()
@Entity()
export class RoomUser extends BaseEntity {
  @PrimaryColumn()
  roomId: number;

  @PrimaryColumn()
  userId: number;

  // Relations
  @ManyToOne(() => Room, (room) => room.userConnection, { primary: true })
  @JoinColumn({ name: "roomId" })
  room: Room;

  @ManyToOne(() => User, (user) => user.roomConnection, { primary: true })
  @JoinColumn({ name: "userId" })
  user: User;
}
