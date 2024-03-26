import { HTTPStatus } from "../constants/StatusCode.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Category, Expense, User } from "../configs/postgresql.js";
dotenv.config();

export const getUserExpenses = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    const expenses = await Expense.findAll({
      where: { userId: tokenDetails.id },
      include: [
        { model: User, as: "user", attributes: ["email"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Fetch all expenses of user", expenses });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { label, amount, categoryId } = req.body;
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    if (!label) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a label for expense",
      });
    }
    if (isNaN(amount)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a valid expense amount",
      });
    }
    if (!categoryId) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie category of expense",
      });
    }
    const categoryExist = await Category.findOne({ where: { id: categoryId } });
    if (!categoryExist) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Invalid category, Try Again",
      });
    }
    await Expense.create({
      label,
      amount,
      categoryId,
      userId: tokenDetails.id,
    });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Added new expense" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
