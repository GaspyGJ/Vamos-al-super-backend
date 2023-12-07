import { getConnection, pool } from "../Database/db.js";

const productos = (req, res) => {
  res.json("Productos");
};

const getList = async (req, res) => {
  console.log("RUN productos.controller.getList");
  try {
    var connection = await getConnection();
    const [list] = await connection.query(
      `SELECT id, nombre FROM Productos ORDER BY nombre`
    );
    if (list.length <= 0) {
      throw new Error("Productos no encontrado");
    }
    console.log("RETURN productos.controller.getList (size)",list.length);
     res.status(200).json(list);
  } catch (error) {
    console.log("RETURN ERROR productos.controller.getList");
    console.error(error);
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};
 
const insert = async (req, res) => {
  console.log("RUN productos.controller.insert");
  const { nombre } = req.body;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [response] = await connection.query(
      `INSERT INTO Productos(nombre) VALUES (?);`,
      [nombre]
    );
    if (response.insertId <= 0) {
      throw new Error("Error al insertar Producto");
    }
    console.log("RETURN productos.controller.insert",{ id: response.insertId, nombre });
    await connection.commit();
     res.status(200).json({ id: response.insertId, nombre });
  } catch (error) {
    console.log("RETURN ERROR productos.controller.insert");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const update = async (req, res) => {
  console.log("RUN productos.controller.update");
  const { id, nombre } = req.body;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [response] = await connection.query(
      `UPDATE Productos set nombre= IFNULL(?,nombre) WHERE id=?;`,
      [nombre, id]
    );
    if (response.affectedRows <= 0) {
      throw new Error("No se encontro el producto");
    }
    const [list] = await connection.query(
      `SELECT id,nombre FROM Productos WHERE id=?`,
      [id]
    );
    console.log("RETURN productos.controller.update",list[0]);
    await connection.commit();
     res.status(200).json(list[0]);
  } catch (error) {
    console.log("RETURN ERROR productos.controller.update");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const remove = async (req, res) => {
  console.log("RUN productos.controller.update");
  const { id } = req.body;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [response] = await connection.query(
      `DELETE FROM Productos WHERE id=?`,
      [id]
    );
    console.log(response.affectedRows);
    if (response.affectedRows <= 0) {
      throw new Error("Producto no encontrado");
    }
    console.log("RETURN productos.controller.remove","Producto eliminado");
    await connection.commit();
     res.status(200).json("Producto eliminado");
  } catch (error) {
    console.log("RETURN ERROR productos.controller.remove");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const getOrCreate = async (req, res) => {
  console.log("RUN productos.controller.getOrCreate");
  const { nombre } = req.body;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [list] = await connection.query(
      `SELECT id, nombre FROM Productos WHERE nombre=?`,
      [nombre]
    );
    if (list.length <= 0) {
      const [response] = await connection.query(
        `INSERT INTO Productos(nombre) VALUES (?);`,
        [nombre]
      );
      if (response.insertId <= 0) {
        throw new Error("Error al insertar Producto");
      }
      console.log("RETURN productos.controller.getOrCreate",{ id: response.insertId, nombre });
      await connection.commit();
       res.status(200).json({ id: response.insertId, nombre });
    } else {
      await connection.commit();
       res.status(200).json(list[0]);
    }
  } catch (error) {
    console.log("RETURN ERROR productos.controller.getOrCreate");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

/*const getById = async (req, res) => {
  const { id } = res.body;
  try {
    const [list] = await connection.query(
      `SELECT id, nombre FROM Productos WHERE id=?`,
      [id]
    );
    res.status(200).json(list);
    if (list.length <= 0) {
       res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};*/

export const controller = {
  productos,
  getList,
  insert,
  update,
  remove,
  getOrCreate,
};
