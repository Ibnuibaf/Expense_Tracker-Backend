import { DataTypes } from "sequelize";

const categoryModel=(sequelize)=>{

    return sequelize.define("Category",{
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    })
}

export default categoryModel