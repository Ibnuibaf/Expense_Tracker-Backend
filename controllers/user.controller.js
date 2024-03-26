import { User } from "../configs/postgresql.js";
import {
  emailRegex,
  passwordRegex,
  usernameRegex,
} from "../constants/Regex.js";
import { HTTPStatus } from "../constants/StatusCode.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getUser = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const tokenDetails = JWT.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: tokenDetails.id },
      attributes: { exclude: ["password"] },
    });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "UserDetails fetched", user });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!emailRegex.test(email)) {
      return res
        .status(HTTPStatus.client_err)
        .send({ success: false, message: "Provide valid email" });
    }
    if (!usernameRegex.test(name)) {
      return res
        .status(HTTPStatus.client_err)
        .send({ success: false, message: "Provide valid username" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message:
          "Password should contain least 8 Characters, 1 UpperCase, 1 LowerCase.",
      });
    }
    const ExistUser = await User.findOne({ where: { email } });
    if (ExistUser) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "User Already exist, Try login to account",
      });
    }
    const encryptedPass = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: encryptedPass,
    });
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
      return res
        .status(HTTPStatus.client_err)
        .send({ success: false, message: "Provide valid email" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "User not found, Try after register",
      });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(HTTPStatus.client_err).send({
        success: false,
        message: "Incorrect Credentials, Try again",
      });
    }
    const token = JWT.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    res
      .status(HTTPStatus.success)
      .send({ success: true, message: "User LoggedIn", token });
  } catch (error) {
    console.error(error);
    res
      .status(HTTPStatus.server_err)
      .send({ success: false, message: "Server Error, Try Again" });
  }
};

