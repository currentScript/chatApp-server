import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";
import { Upload } from "../../types/Upload";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import fs from "fs";
import isImage from "is-image";

@Resolver()
export class ProfilePictureResolver {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    if (!isImage(filename)) {
      return false;
    }

    const user = await User.findOne({ where: { id: ctx.req.session.userId } });
    if (!user) {
      return false;
    }

    // delete old picture first
    if (user.image) {
      fs.unlink(`images/profile/${user.image}.jpg`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const fileName = uuidv4();

    await User.update({ id: ctx.req.session.userId }, { image: fileName });
    createReadStream()
      .pipe(
        createWriteStream(
          __dirname + `/../../../images/profile/${fileName}.jpg`
        )
      )
      .on("error", () => new Error("Error: Something went wrong"));

    return true;
  }
}
