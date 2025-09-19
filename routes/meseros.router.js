const express = require('express');
const router = express.Router();
const { db, Timestamp } = require('../db'); // Importa la conexión centralizada

// Crear documento usuario
router.post("/", async (req, res) => { //Ruta POST
  try {
    const { apellido, nombre, telefono } = req.body;
    // Usar Timestamp de Firebase para fecha_contratacion
    const fecha_contratacion = admin.firestore.Timestamp.now();
    console.log(fecha_contratacion);
    // Agregar documento a la colección "meseros"
    const docRef = await db.collection("meseros").add({ apellido, fecha_contratacion, nombre, telefono });
    res.json({ id: docRef.id, message: "Mesero agregado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Obtener datos de los documentos
router.get("/", async (req, res) => {
  try {
    const items = await db.collection("meseros").get();

    const meseros = items.docs.map(doc => { // Mapear documentos a un array de objetos
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        apellido: data.apellido,
        fecha_contratacion: data.fecha_contratacion,
        telefono: data.telefono
      };
    });

    res.json(meseros); // Enviar array de meseros como respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener datos de los documentos
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const mesero = await db.collection("meseros").doc(id).get();

    res.json(mesero.data()); // Enviar array de meseros como respuesta en JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fecha_contratacion = admin.firestore.Timestamp.now();
    console.log(fecha_contratacion, id, req.body.apellido, req.body.nombre, req.body.telefono);
    const data = await db.collection("meseros").doc(id).update({ ...req.body });
    res.json({ message: "Mesero modificado completamente", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { apellido, nombre, telefono } = req.body;
    const fecha_contratacion = admin.firestore.Timestamp.now();
    await db.collection("meseros").doc(id).set({ apellido, nombre, telefono, fecha_contratacion });
    // Leer el documento actualizado para devolver los datos nuevos
    const updatedSnap = await db.collection("meseros").doc(id).get();
    const updatedData = { id: updatedSnap.id, ...updatedSnap.data() };

    res.json({ message: "Mesero actualizado parcialmente", data: updatedData });
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