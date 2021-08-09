import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { Upload } from "../../types/Upload";
import { v4 as uuidv4 } from "uuid";
import { MyContext } from "../../types/MyContext";
import fs from "fs";
import { Room } from "../../entity/Room";
import isImage from "is-image";
import { RoomAdmin } from "../../entity/RoomAdmin";

@Resolver()
export class RoomPictureResolver {
  @Mutation(() => Boolean)
  async addRoomPicture(
    @Arg("picture", () => GraphQLUpload)
    { createReadStream, filename }: Upload,
    @Arg("roomId") roomId: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    if (!isImage(filename)) {
      return false;
    }

    const valid = await RoomAdmin.findOne({
      where: { userId: ctx.req.session.userId, roomId },
    });
    if (!valid) {
      return false;
    }

    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) {
      return false;
    }

    // * delete old picture first * //
    if (room.image) {
      fs.unlink(`images/room/${room.image}.jpg`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const fileName = uuidv4();

    await Room.update({ id: roomId }, { image: fileName });
    createReadStream()
      .pipe(
        createWriteStream(__dirname + `/../../../images/room/${fileName}.jpg`)
      )
      .on("error", () => new Error("Error: Something went wrong"));

    return true;
  }
}
