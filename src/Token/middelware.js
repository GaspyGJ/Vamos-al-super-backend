import { verifyToken } from "./jwt.js";

export const checkToken = (req, res, next) => {
  console.log("Intento de acceso.");

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(500).json({ message: "Cabecera sin Token" });
  }
  try {
    const payload = verifyToken(token);
    //console.log("playload", payload);
    //console.log("token", token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  console.log("Acceso OK.");

  next();
};
