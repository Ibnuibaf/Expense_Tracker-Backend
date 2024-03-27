import { DataTypes } from "sequelize";
import { Category, Expense, User } from "../configs/postgresql.js";

const collaboratorModel = (sequelize) => {
  return sequelize.define("Collaborator", {
    expenseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Expense,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    sharedBy:{
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
  });
};

export default collaboratorModel;
