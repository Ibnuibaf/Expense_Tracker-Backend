import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../configs/postgresql.js";
import { HTTPStatus } from "../constants/StatusCode.js";
dotenv.config()
export const isLoggedIn = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
      if (!authorization) {
        return res.status(HTTPStatus.client_err).send({
          success: false,
          message: "Login to your account, for this operation",
        });
      }
      const { id, email } = JWT.verify(authorization, process.env.JWT_SECRET);
      const user = await User.findOne({where:{id}});
      if (!user) {
        return res.status(HTTPStatus.client_err).send({
          success: false,
          message: "User details not found, Try again after login",
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res
        .status(HTTPStatus.server_err)
        .send({ success: false, message: error.message });
    }
  };
  
  export const isNotLoggedIn = (req, res, next) => {
    try {
        const { authorization } = req.headers;
      if (authorization) {
        return res.status(HTTPStatus.client_err).send({
          success: false,
          message: "Already LoggedIn, Try after Log Out",
        });
      }
      next()
    } catch (error) {
      console.log(error);
      res
        .status(HTTPStatus.server_err)
        .send({ success: false, message: error.message });
    }
  };
  