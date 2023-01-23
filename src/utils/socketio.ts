import jwt from "jsonwebtoken";
import { LeanDocument } from "mongoose";
import * as socketio from "socket.io";
import { config } from "../constants/config";
import { User, UserType } from "../resources/user/model.js";
import apiError from "../utils/apiError.js";
export const socket_io = (httpServer: any) => {
  try {
    const io = new socketio.Server().attach(httpServer);
    let user: LeanDocument<UserType> | null;
    const getUser = async (id: any) => {
      let user = await User.findById(id).lean();
      if (!user || user.is_banned) return null;
      return user;
    };

    class socketType extends socketio.Socket {
      decoded: any;
    }
    io.use(function (socket: socketType) {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.secrets.jwt, async function (err: any, decoded: any) {
          if (err) return new Error("[Socket.io]: Authentication error");
          socket.decoded = decoded;
          user = await getUser(socket.decoded.id);
        });
      } else {
        return apiError.badRequest("Authentication error", "socketio");
      }
    }).on("connection", async (socket: socketType) => {
      user = await getUser(socket.decoded.id);
      await User.findOneAndUpdate({ _id: user._id }, { is_online: true, last_seen_online: Date.now(), socket_id: socket.id }).lean(); // online = true
      socket.on("disconnect", async () => {
        user = await getUser(socket.decoded.id);
        await User.findOneAndUpdate({ _id: user._id }, { is_online: false }).lean(); // online = false
      });
    });
  } catch (error) {
    return apiError.internal(error, "socketio");
  }
};
