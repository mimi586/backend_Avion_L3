import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import connection from "../Connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginRoute = express.Router();
loginRoute.use(bodyParser.json());

const secretKey = "9a8351eb26cfb65fa8dcb7f9bca9b65056aa4d7c5e9985a7725c4a5dc95e0b47";

loginRoute.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set secure to false if not using HTTPS
  })
);

loginRoute.post("/", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const query = "SELECT * FROM User WHERE Email = ?";
    connection.query(query, [Email], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      const isPasswordValid = await bcrypt.compare(Password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.Id, role: user.Role }, secretKey, {
        expiresIn: "1h",
      });

      req.session.userId = user.Id;
      req.session.userRole = user.Role;
      req.session.userEmail = user.Email; // store user email in session

      res.setHeader("Authorization", `Bearer ${token}`);
      res.status(200).json({ userId: user.Id, role: user.Role, token, email: user.Email }); // include email in response
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { loginRoute };
