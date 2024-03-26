import { DataTypes } from "sequelize";
import { Category, User } from "../configs/postgresql.js";

const budgetModel = (sequelize) => {
  return sequelize.define("Budget", {
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
};

export default budgetModel;
