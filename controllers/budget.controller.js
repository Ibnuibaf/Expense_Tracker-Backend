import { HTTPStatus } from "../constants/StatusCode.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Budget, Category, User } from "../configs/postgresql.js";
dotenv.config();

export const getUserBudgets = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    const budgets = await Budget.findAll({
      where: { userId: tokenDetails.id },
      include: [
        { model: User, as: "user", attributes: ["email"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Fetch all collabs of user", budgets });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const provideBudget = async (req, res) => {
  try {
    const { amount, categoryId } = req.body;
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    if (isNaN(amount)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Enter a valid amount",
      });
    }
    if (isNaN(categoryId)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provide a valid category",
      });
    }
    const isCategoryExist = await Category.findOne({
      where: { id: categoryId },
    });
    if (!isCategoryExist) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Category not found",
      });
    }
    const isBudgetExist = await Budget.findOne({
      where: { categoryId, userId: tokenDetails.id },
    });
    if (isBudgetExist) {
      await Budget.update(
        { amount },
        { where: { userId: tokenDetails.id, categoryId } }
      );
    } else {
      await Budget.create({ amount, categoryId, userId: tokenDetails.id });
    }
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Added budget to the category" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const removeBudget = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    if (isNaN(categoryId)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provide a valid category",
      });
    }
    const isCategoryExist = await Category.findOne({
      where: { id: categoryId },
    });
    if (!isCategoryExist) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Category not found",
      });
    }
    await Budget.destroy({ where: { categoryId, userId: tokenDetails.id } });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Removed the budget from the category" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
