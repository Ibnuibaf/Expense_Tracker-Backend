import { HTTPStatus } from "../constants/StatusCode.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Collaborator } from "../configs/postgresql.js";
dotenv.config();

export const createCollab = async (req, res) => {
  try {
    const { expenseId, users } = req.body;
    if (NaN(expenseId)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provide a valid expense details to share",
      });
    }
    if (!users.length) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provide a uesrs to share expense with",
      });
    }

    for (let i = 0; i < users.length; i++) {
      await Collaborator.create({ userId: users[i], expenseId });
    }
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Shared expense with users provided" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const getUsersCollabs = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    const collaborations=await Collaborator.findAll({where:{userId:tokenDetails.id}})
    res.status(HTTPStatus.success).send({success:true,message:"Fetch all collabs of user",collaborations})
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
