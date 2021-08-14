import "reflect-metadata";
import { createServer } from "http";
import { createConnection } from "typeorm";
import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import cors from "cors";

// Resolver
import { MessageSubResolver } from "./modules/chat/MessageSub";
import { DeleteMessageResolver } from "./modules/chat/DeleteMessage";
import { CreateRoomResolver } from "./modules/room/CreateRoom";
import { LoadRoomResolver } from "./modules/room/LoadRoom";
import { AddUserToRoomResolver } from "./modules/room/AddUserToRoom";
import { RemoveUserFromRoomResolver } from "./modules/room/RemoveUserFromRoom";
import { LoadRoomParticipantsResolver } from "./modules/room/LoadRoomParticipants";
import { RegisterResolver } from "./modules/user/Register";
import { DeleteUserResolver } from "./modules/user/DeleteUser";
import { LoginResolver } from "./modules/user/Login";
import { AddFriendResolver } from "./modules/user/friendSystem/AddFriend";
import { RemoveFriendResolver } from "./modules/user/friendSystem/RemoveFriend";
import { GetAllFriendsResolver } from "./modules/user/friendSystem/GetAllFriends";
import { AddAdminToRoomResolver } from "./modules/room/admin/AddAdminToRoom";
import { LeaveRoomResolver } from "./modules/room/LeaveRoom";
import { RemoveAdminFromRoomResolver } from "./modules/room/admin/RemoveAdminFromRoom";
import { AboutMeResolver } from "./modules/user/aboutMe/AboutMe";
import { LoadAllRoomsResolver } from "./modules/room/LoadAllRooms";
import { MeResolver } from "./modules/user/Me";

// Session
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import { DeleteRoomResolver } from "./modules/room/DeleteRoom";

// Upload
import { graphqlUploadExpress } from "graphql-upload";
import { ProfilePictureResolver } from "./modules/user/ProfilePicture";
import { LogoutResolver } from "./modules/user/logout";
import { RoomPictureResolver } from "./modules/room/RoomPicture";

const main = async () => {
  await createConnection();
  const app = express();
  const pubsub = new PubSub();

  // * handle images * //
  app.use("/imageProfile", express.static("images/profile"));
  app.use("/imageRoom", express.static("images/room"));

  const schema = await buildSchema({
    resolvers: [
      MessageSubResolver,
      CreateRoomResolver,
      LoadRoomResolver,
      DeleteMessageResolver,
      RegisterResolver,
      DeleteUserResolver,
      AddUserToRoomResolver,
      LoadRoomParticipantsResolver,
      RemoveUserFromRoomResolver,
      LoginResolver,
      AddFriendResolver,
      RemoveFriendResolver,
      GetAllFriendsResolver,
      AddAdminToRoomResolver,
      LeaveRoomResolver,
      RemoveAdminFromRoomResolver,
      AboutMeResolver,
      LoadAllRoomsResolver,
      MeResolver,
      DeleteRoomResolver,
      ProfilePictureResolver,
      LogoutResolver,
      RoomPictureResolver,
    ],
  });
  const RedisStore = connectRedis(session);

  const sessionMiddleware = session({
    store: new RedisStore({
      client: redis,
    }),
    name: "qid",
    secret: "dhajskldwjdhlJW",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    uploads: false,

    context: ({ req, res, connection }) => ({ req, res, connection, pubsub }),

    subscriptions: {
      onConnect: (_, ws: any) => {
        return new Promise((res) =>
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            res({ req: ws.upgradeReq });
          })
        );
      },
    },
  });

  app.use(
    sessionMiddleware,
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    }),
    // 2097152 = 2 MiB    // https://meta.stackexchange.com/questions/169543/what-are-the-displayed-and-maximum-uploaded-profile-picture-sizes
    graphqlUploadExpress({ maxFileSize: 2097152, maxFiles: 1 })
  );

  const httpServer = createServer(app);
  apolloServer.applyMiddleware({ app, cors: false });
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(4000, () => {
    console.log("Server started on http://localhost:4000/graphql");
  });
};

main();
