require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());

// Ruta para registrar visitas
app.get('/api/registrar-visita', async (req, res) => {
    try {
        const nuevaVisita = {
            ip: req.ip,
            user_agent: req.get('User-Agent'),
            fecha: new Date(),
        };

        const { data, error } = await supabase
            .from('visitas')
            .insert([nuevaVisita]);

        if (error) throw error;

        res.status(201).json({ message: 'Visita registrada correctamente.', data });
    } catch (error) {
        console.error('Error al registrar la visita:', error);
        res.status(500).json({ error: 'Error al registrar la visita.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});