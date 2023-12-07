-- Crear la tabla Productos
CREATE TABLE IF NOT EXISTS Productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL
);

-- Crear la tabla Compras si no existe
CREATE TABLE IF NOT EXISTS Compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME NOT NULL,
    total FLOAT NOT NULL,
    presupuesto_inicial FLOAT DEFAULT null,
    supermercado VARCHAR(50) DEFAULT null,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Crear la tabla Compras-Productos
CREATE TABLE IF NOT EXISTS Compras_Productos(
    producto_id INT,
    compra_id INT,
    PRIMARY KEY(producto_id,compra_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(id),
    FOREIGN KEY (compra_id) REFERENCES Compras(id),
    cantidad INT NOT NULL,
    unidad_cantidad VARCHAR(50) NOT NULL,
    unidad_precio VARCHAR(50) NOT NULL,
    precio FLOAT NOT NULL,
    total_precio FLOAT NOT NULL
);


-- Crear la tabla Compras-Productos
CREATE TABLE IF NOT EXISTS Usuario(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    contrasenia varchar(100),
    proveedor varchar(50) NOT NULL
);