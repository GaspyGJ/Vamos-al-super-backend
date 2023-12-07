import { getConnection, pool } from "../Database/db.js";

const compras = (req, res) => {
  return res.send("Compras");
};

const getList = async (req, res) => {
  console.log("RUN compras.controller.getList");
  
  try {
    var connection = await getConnection();
    const [list] = await connection.query(
      `SELECT * FROM Compras ORDER BY fecha`
    );
    if (list.length <= 0) {
      throw new Error("Compras no encontradas");
    }
    console.log("RETURN compras.controller.getList",list);
     res.status(200).json(list);
  } catch (error) {
    console.log("RETURN ERROR compras.controller.getList");
    console.error(error);
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const insert = async (req, res) => {
  console.log("RUN compras.controller.insert");
  const {
    fecha,
    productos,
    total,
    presupuestoInicial,
    supermercado,
    usuario_id,
  } = req.body;

  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [response] = await connection.query(
      `INSERT INTO Compras(fecha,total,presupuesto_inicial,supermercado,usuario_id) VALUES (?,?,?,?,?);`,
      [new Date(fecha), total, presupuestoInicial, supermercado, usuario_id]
    );

    const idCompra = response.insertId;
    if (idCompra <= 0) {
      throw new Error("Error al insertar Compra");
    }
    productos.forEach(async (prod) => {
      const [result] = await connection.query(
        `INSERT INTO Compras_Productos
            (producto_id,compra_id,cantidad,unidad_cantidad,
            precio,unidad_precio,total_precio) VALUES (?,?,?,?,?,?,?);`,
        [
          prod.id,
          idCompra,
          prod.cantidad,
          prod.unidad_cantidad,
          prod.precio,
          prod.unidad_precio,
          prod.total_precio,
        ]
      );
      if (result.insertId <= 0 && result.affectedRows <= 0) {
        throw new Error("Error al insertar Compras_Productos");
      }
    });
    console.log("RETURN compras.controller.insert",{ id: idCompra, fecha, productos });
    await connection.commit();
     res.status(200).json({ id: idCompra, fecha, productos });
  } catch (error) {
    console.log("RETURN ERROR compras.controller.insert");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const getComprasByUser = async (req, res) => {
  console.log("RUN compras.controller.getComprasByUser");
  const usuario_id = req.params.usuario_id;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();

    const [compras] = await connection.query(
      `SELECT id, fecha, total, presupuesto_inicial, supermercado
      FROM Compras
      WHERE usuario_id=?
      `,
      [usuario_id]
    );
    // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
    const listComprasConProductos = await Promise.all(
      compras.map(async (compra) => {
        const [listaProductos] = await connection.query(
          `SELECT P.id, P.nombre, cantidad, unidad_cantidad, unidad_precio, precio, total_precio
        FROM (Compras_Productos AS CP JOIN Compras AS C ON CP.compra_id=C.id) 
            JOIN Productos AS P ON CP.producto_id=P.id
        WHERE compra_id=?
        `,
          [compra.id]
        );
        return { ...compra, productos: listaProductos };
      })
    );

    console.log("RETURN compras.controller.getComprasByUser",listComprasConProductos);
    await connection.commit();
     res.status(200).json(listComprasConProductos);
  } catch (error) {
    console.log("RETURN ERROR compras.controller.getComprasByUser");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

const getProductosByCompra = async (req, res) => {
  console.log("RUN compras.controller.getProductosByCompra");
 
  const compra_id = req.params.compra_id;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    const [list] = await connection.query(
      `SELECT P.id,P.nombre,cantidad,unidad_cantidad,unidad_precio,precio,total_precio
        FROM (Compras_Productos AS CP JOIN Productos AS P ON CP.producto_id=P.id) 
			      JOIN Compras AS C ON CP.compra_id=?
      `,
      [compra_id]
    );
    console.log("RETURN compras.controller.getProductosByCompra",list);
    await connection.commit();
     res.status(200).json(list);
  } catch (error) {
    console.log("RETURN ERROR compras.controller.getProductosByCompra");
    console.error(error);
    await connection.rollback();
     res.status(500).json(error.message);
  }
  finally{
    connection.release();
  }
};

export const controller = {
  compras,
  getList,
  insert,
  getComprasByUser,
  getProductosByCompra,
};
