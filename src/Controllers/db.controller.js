import { getConnection } from "../Database/db.js";

const database = async (req, res) => {
  var connection = await getConnection();
  const [result] = await connection.query(
    "Select 'Running Database' AS result"
  );
  connection.release();
  res.json(result[0]);
};

const createProductosTable = `
    CREATE TABLE IF NOT EXISTS Productos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      nombre VARCHAR(255) NOT NULL
    );
  `;
const createComprasTable = `
    CREATE TABLE IF NOT EXISTS Compras (
      id INT PRIMARY KEY AUTO_INCREMENT,
      fecha DATE NOT NULL
    );
  `;
const createComprasProductosTable = `
    CREATE TABLE IF NOT EXISTS Compras_Productos (
      producto_id INT,
      compra_id INT,
      FOREIGN KEY (producto_id) REFERENCES Productos(id),
      FOREIGN KEY (compra_id) REFERENCES Compras(id),
      PRIMARY KEY(producto_id, compra_id)
    );
  `;

const createDatabase = async (req, res) => {
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [resultProductos] = await connection.query(createProductosTable);
    const [resultCompras] = await connection.query(createComprasTable);
    const [resultComprasProdcutos] = await connection.query(
      createComprasProductosTable
    );
    await connection.commit();
    res.json("Create OK");
  } catch (error) {
    await connection.rollback();
    console.error(error);
     res.status(500).json(error);
  }
  finally{
    connection.release();
  }
};

export const controller = {
  database,
  createDatabase,
};
