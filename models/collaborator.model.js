import { DataTypes } from "sequelize";
import { Expense, User } from "../configs/postgresql.js";

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
    }
  });
};

export default collaboratorModel;
