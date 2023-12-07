import express from "express";
import cors from "cors";

import indexRoutes from "./src/Routes/index.routes.js";
import dbRoutes from "./src/Routes/db.routes.js";
import productosRoutes from "./src/Routes/productos.routes.js";
import comprasRoutes from "./src/Routes/compras.routes.js";
import authRouter from "./src/Routes/usuario.routes.js";

const app = express();
app.use(express.json());
/*
app.use(cors({
    origin: '*'
}));
 */
app.use(
  cors({
    origin: [process.env.URL_CORS, "http://localhost:4200"],
  })
);
app.use(indexRoutes);
app.use("/databse", dbRoutes);
app.use("/productos", productosRoutes);
app.use("/compras", comprasRoutes);
app.use("/auth", authRouter);
app.use((req, res, next) => {
  res.status(404).json({
    message: "ruta no econtrada",
  });
});

app.listen(process.env.PORT || 3000, "0.0.0.0", function () {
  console.log("Server listen on " + (process.env.PORT || 3000));
});
