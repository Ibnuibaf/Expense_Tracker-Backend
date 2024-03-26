import { DataTypes, Sequelize } from "sequelize";

const userModel=(sequelize)=>{

    return sequelize.define("User",{
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password:{
            type:DataTypes.STRING,
            allowNull: false,
        }
    })
}

export default userModel