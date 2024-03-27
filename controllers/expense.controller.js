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
    const { label, amount, categoryId, isRecurring } = req.body;
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
    let expense;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    isRecurring
      ? (expense = await Expense.create({
          label,
          amount,
          categoryId,
          userId: tokenDetails.id,
          isRecurring,
          lastPay:currentDate
        }))
      : (expense = await Expense.create({
          label,
          amount,
          categoryId,
          userId: tokenDetails.id,
        }));
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "Added new expense", expense });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const recurringPayment = async (req, res) => {
  try {
    const { expenseId } = req.body;
    if (isNaN(expenseId)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie a valid expense",
      });
    }
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (!expense) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "No such expense found, try again",
      });
    }
    if (!expense.isRecurring) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Provdie expense is not recurring",
      });
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    await Expense.update(
      { lastPay: currentDate },
      { where: { id: expenseId } }
    );
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};
