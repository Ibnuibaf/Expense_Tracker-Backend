import { HTTPStatus } from "../constants/StatusCode.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Budget, Category, Expense, User } from "../configs/postgresql.js";
import { Op } from "sequelize";
import { sendVerificationMail } from "../utils/nodemailer.js";
dotenv.config();

export const getUserExpenses = async (req, res) => {
  try {
    const { search, category } = req.query;
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    const whereClause = {
      userId: tokenDetails.id,
    };
    if (search) {
      whereClause.label = { [Op.like]: `%${search}%` };
    }
    if (category) {
      whereClause.categoryId = category;
    }
    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        { model: User, as: "user", attributes: ["email"] },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
    expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    const categoriesBudget = await Budget.findOne({
      where: { categoryId, userId: tokenDetails.id },
    });
    const expenses = await Expense.findAll({
      where: { userId: tokenDetails.id, categoryId },
    });
    let totalCategoryAmount = 0;
    expenses.forEach((expense) => {
      totalCategoryAmount += Number(expense.amount);
    });
    console.log(
      totalCategoryAmount,
      Number(categoriesBudget.amount),
      "heheheh"
    );
    if (
      Number(totalCategoryAmount) + Number(amount) >
      Number(categoriesBudget.amount)
    ) {
      await sendVerificationMail(
        tokenDetails.email,
        `You have exceed your budget limit by $${
          Number(totalCategoryAmount) + Number(amount)
        } where your budget is $${Number(categoriesBudget.amount)}`
      );
    } else if (
      Number(totalCategoryAmount) + Number(amount) ==
      Number(categoriesBudget.amount)
    ) {
      await sendVerificationMail(
        tokenDetails.email,
        `You have reached your budget limit by $${
          Number(totalCategoryAmount) + Number(amount)
        }`
      );
    } else if (
      Number(totalCategoryAmount) + Number(amount) >
      Number(categoriesBudget.amount) - 2000
    ) {
      await sendVerificationMail(
        tokenDetails.email,
        `You have come close to your budget limit by $${
          Number(totalCategoryAmount) + Number(amount)
        } where your budget is $${Number(categoriesBudget.amount)}`
      );
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
          lastPay: currentDate,
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
