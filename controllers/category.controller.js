import { Category } from "../configs/postgresql.js";
import { HTTPStatus } from "../constants/StatusCode.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

export const getCategories = async (req, res) => {
  try {
    const categories=await Category.findAll()
    res.status(HTTPStatus.success).send({success:true,message:"All categories fetched", categories})
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    if (!name) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a name for category",
      });
    }
    const isExist = await Category.findOne({
      where: { name: { [Op.iLike]: name } },
    });
    if (isExist) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Category already exist",
      });
    }
    await Category.create({ name });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Added new category" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id,name } = req.body;
    if (isNaN(id)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a valid category to update",
      });
    }
    if (!name) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a name for category",
      });
    }
    const isExist = await Category.findOne({
      where: { name: { [Op.iLike]: name } },
    });
    if (isExist) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Category already exist",
      });
    }
    await Category.update({ name },{where:{id}});
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Updated existing category" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
