import { Sequelize } from "sequelize";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
import categoryModel from "../models/category.model.js";
import expenseModel from "../models/expense.model.js";
import budgetModel from "../models/budget.model.js";
import collaboratorModel from "../models/collaborator.model.js";
dotenv.config();

let User = null;
let Category = null;
let Expense = null;
let Budget = null
let Collaborator=null
const connectDB = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
    }
  );
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    User = userModel(sequelize);
    Category = categoryModel(sequelize);
    Expense=expenseModel(sequelize)
    Expense.belongsTo(User, { foreignKey: "userId", as: "user" });
    Expense.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    Budget=budgetModel(sequelize)
    Budget.belongsTo(User, { foreignKey: "userId", as: "user" });
    Budget.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    Collaborator=collaboratorModel(sequelize)
    Collaborator.belongsTo(User, { foreignKey: "userId", as: "user" });
    Collaborator.belongsTo(Expense, { foreignKey: "expenseId", as: "expense" });
    await sequelize.sync();
    console.log("Table created Successfuly");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User, Category, Expense, Budget, Collaborator };

export default connectDB;
