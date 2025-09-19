const express = require('express');
const router = express.Router();
const { db, Timestamp } = require('../db'); // Importa la conexión centralizada

// Crear documento usuario
router.post("/", async (req, res) => {
  try {
    const { categoriaId, descripcion, nombre, precio } = req.body;

    if (!categoriaId || !nombre || !precio) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: categoriaId, nombre, o precio."
      });
    }

    const categoriaRef = db.collection('categorias').doc(categoriaId);

    const nuevoPlato = {
      categoria: categoriaRef,
      descripcion: descripcion || "",
      nombre: nombre,
      precio: precio
    };

    const docRef = await db.collection("platillos").add(nuevoPlato);

    res.status(201).json({
      id: docRef.id,
      message: "Plato agregado exitosamente"
    });

  } catch (error) {
    console.error("Error al crear el plato:", error);
    res.status(500).json({
      error: "Error interno del servidor al procesar la solicitud."
    });
  }
});


// Obtener datos de los documentos
router.get("/", async (req, res) => {
  try {
    const items = await db.collection("platillos").get();

    const platillos = items.docs.map(doc => { // Mapear documentos a un array de objetos
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        categoriaId: data.categoria.path.split('/')[1],
        descripcion: data.descripcion,
        precio: data.precio
      };
    });

    res.json(platillos); // Enviar array de meseros como respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener datos de los documentos
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const platillo = await db.collection("platillos").doc(id).get();
    const data = { ...platillo.data(), categoria: platillo.data().categoria.path.split('/')[1] };
    res.json(data); // Enviar array de meseros como respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("platillos").doc(id).update({ ...req.body });


    const updatedSnap = await db.collection("platillos").doc(id).get();
    const updatedData = { id: updatedSnap.id, ...updatedSnap.data() };
    updatedData.categoriaId = updatedData.categoria.path.split('/')[1];
    delete updatedData.categoria;
    res.json({ message: "Platillo actualizado parcialmente", data: updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { categoriaId, descripcion, precio, nombre } = req.body;
    if (!categoriaId || !nombre || !precio) {
      return res.status(400).json({
        message: "Faltan campos obligatorios: categoriaId, nombre, o precio."
      });
    }
    
    await db.collection("platillos").doc(id).set({ categoriaId, descripcion, precio, nombre });
    // Leer el documento actualizado para devolver los datos nuevos
    const updatedSnap = await db.collection("platillos").doc(id).get();
    const updatedData = { id: updatedSnap.id, ...updatedSnap.data() };

    res.json({ message: "Platillo actualizado parcialmente", data: updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("meseros").doc(id).delete();
    res.json({ message: "Mesero eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;