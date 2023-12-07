import { getConnection, pool } from "../Database/db.js";
import { createToken } from "../Token/jwt.js";

const register = async (req, res) => {
  const { nombre, email, contrasenia, proveedor } = req.body;
  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    if (email) {
      const [response] = await connection.query(
        `SELECT * FROM Usuario WHERE email=?`,
        [email]
      );
      if (response.length > 0) {
        throw new Error("Email ya registrado");
      }
    }
    const [response] = await connection.query(
      `INSERT INTO Usuario(nombre,email,contrasenia,proveedor) VALUES (?,?,?,?);`,
      [nombre, email, contrasenia, proveedor]
    );
    if (response.insertId <= 0) {
      throw new Error("Error al insertar Usuario");
    }
    await connection.commit();
    const usuario = {
      id: response.insertId,
      nombre,
      email,
      contrasenia,
      proveedor,
    };
    console.log(usuario);
    const respuesta = {
      usuario,
      token: createToken(usuario),
    };
     res.status(200).json(respuesta);
  } catch (error) {
    console.error(error);
    await connection.rollback();
     res.status(500).json({ message: error.message });
  }
  finally{
    connection.release();
  }
};

const login = async (req, res) => {
  const { email, contrasenia, proveedor } = req.body;

  try {
    var connection = await getConnection();
    await connection.beginTransaction();
    if (email) {
      const [userList] = await connection.query(
        `SELECT * FROM Usuario WHERE email=?`,
        [email]
      );
      if (userList.length <= 0) {
        throw new Error("Email no encontrado");
      }
      const user = userList[0];
      if (proveedor != "GOOGLE") {
        //si el proveedor no es google, chekeo la contrasenia
        if (user.contrasenia != contrasenia) {
          throw new Error("Contrasenia incorrecta");
        }
      }
      await connection.commit();
      const usuario = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        proveedor: user.proveedor,
      };
      const response = {
        usuario,
        token: createToken(usuario),
      };
      console.log(response);

       res.status(200).json(response);
    } else {
      throw new Error("Email invalido");
    }
  } catch (error) {
    console.error(error);
    await connection.rollback();
     res.status(500).json({ message: error.message });
  }
  finally{
    connection.release();
  }
};

const getList = async (req, res) => {

  try {
    var connection = await getConnection();
    const [userList] = await connection.query(`SELECT * FROM Usuario`, []);
    console.log(userList);
     res.status(200).json(userList);
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: error.message });
  }
  finally{
    connection.release();
  }
};

export const controller = {
  register,
  login,
  getList,
};
