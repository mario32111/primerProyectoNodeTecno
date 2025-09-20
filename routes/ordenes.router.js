const express = require('express');
const router = express.Router();
const { db, Timestamp } = require('../db'); // Importa la conexión centralizada

// Crear documento usuario
router.post("/", async (req, res) => { //Ruta POST
    try {
        const { estado, id_mesa, id_mesero, tipo_pago, total } = req.body;
        // Usar Timestamp de Firebase para fecha_contratacion    
        const fecha = Timestamp.now();
        if (!estado || !id_mesa || !id_mesero || !tipo_pago || !total) {
            return res.status(400).json({ message: "Faltan campos obligatorios: estado, id_mesa, id_mesero, tipo_pago, o total." });
        }

        mesaRef = db.collection('mesas').doc(id_mesa);
        meseroRef = db.collection('meseros').doc(id_mesero);

        // Agregar documento a la colección "meseros"
        const docRef = await db.collection("meseros").add({ estado, id_mesa: mesaRef, id_mesero: meseroRef, tipo_pago, total, fecha });
        res.json({ id: docRef.id, message: "Mesero agregado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Obtener datos de los documentos
router.get("/", async (req, res) => {
    try {
        const items = await db.collection("ordenes").get();

        const ordenes = items.docs.map(async doc => { // Mapear documentos a un array de objetos

            const id_mesa = doc.data().id_mesa._path.segments[1];
            const id_mesero = doc.data().id_mesero._path.segments[1];

            const mesaData = await db.collection("mesas").doc(id_mesa).get();
            const meseroData = await db.collection("meseros").doc(id_mesero).get();
            console.log(mesaData.data());
            console.log(meseroData.data());
            const data = doc.data();
            return {
                id: doc.id,
                estado: data.estado,
                mesa: mesaData.data(),
                mesero: meseroData.data(),
                tipo_pago: data.tipo_pago,
                total: data.total,
                fecha: data.fecha
            };
        });
        const ordenesResolved = await Promise.all(ordenes);
        res.json(ordenesResolved); // Enviar array de ordenes como respuesta en JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Obtener datos de los documentos
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const orden = await db.collection("ordenes").doc(id).get();
        const data = orden.data();
        const id_mesa = data.id_mesa._path.segments[1];
        const id_mesero = data.id_mesero._path.segments[1];
        const mesaData = await db.collection("mesas").doc(id_mesa).get();
        const meseroData = await db.collection("meseros").doc(id_mesero).get();
        res.json({
            id: orden.id,
            estado: data.estado,
            mesa: mesaData.data(),
            mesero: meseroData.data(),
            tipo_pago: data.tipo_pago,
            total: data.total,
            fecha: data.fecha
        }); // Enviar array de meseros como respuesta en JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("ordenes").doc(id).update({ ...req.body });

        const data = (await db.collection("ordenes").doc(id).get()).data();
        const id_mesa = data.id_mesa._path.segments[1];
        const id_mesero = data.id_mesero._path.segments[1];
        const mesaData = await db.collection("mesas").doc(id_mesa).get();
        const meseroData = await db.collection("meseros").doc(id_mesero).get();
        console.log(mesaData.data());
        console.log(meseroData.data());
        console.log(id_mesa, id_mesero);
        res.json({
            id: id,
            estado: data.estado,
            mesa: mesaData.data(),
            mesero: meseroData.data(),
            tipo_pago: data.tipo_pago,
            total: data.total,
            fecha: data.fecha
        }); // Enviar array de meseros como respuesta en JSON
        res.json({ message: "Orden modificada parcialmente", data });

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, id_mesa, id_mesero, tipo_pago, total } = req.body;
        if (!estado || !id_mesa || !id_mesero || !tipo_pago || !total) {
            return res.status(400).json({ message: "Faltan campos obligatorios: estado, id_mesa, id_mesero, tipo_pago, o total." });
        }
        await db.collection("ordenes").doc(id).set({ estado, id_mesa, id_mesero, tipo_pago, total });
        // Leer el documento actualizado para devolver los datos nuevos
        const updatedSnap = await db.collection("ordenes").doc(id).get();
        const updatedData = { id: updatedSnap.id, ...updatedSnap.data() };

        res.json({ message: "Orden actualizada completamente", data: updatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("ordenes").doc(id).delete();
        res.json({ message: "Orden eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;