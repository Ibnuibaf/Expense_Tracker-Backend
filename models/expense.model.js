import { DataTypes } from "sequelize";
import { Category, User } from "../configs/postgresql.js";

const expenseModel = (sequelize) => {
  return sequelize.define("Expense", {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    isRecurring:{
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastPay:{
      type:DataTypes.DATE,
      allowNull:true
    }
  });
};

export default expenseModel;
