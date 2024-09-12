require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Variables de entorno para Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para registrar visita
app.get('/api/registrar-visita', async (req, res) => {
    try {
        // Información de la visita
        const nuevaVisita = {
            ip: req.ip,
            user_agent: req.get('User-Agent'),
            fecha: new Date().toISOString(),
        };

        // Inserción en Supabase
        const { data, error } = await supabase
            .from('visitas')
            .insert([nuevaVisita]);

        if (error) {
            console.error('Error al registrar la visita:', error.message);
            console.error('Detalles del error:', error);
            return res.status(500).json({ error: 'Error al registrar la visita.' });
        }

        // Respuesta exitosa
        res.status(201).json({ message: 'Visita registrada correctamente.', data });
    } catch (error) {
        console.error('Error al registrar la visita:', error.message);
        res.status(500).json({ error: 'Error al registrar la visita.' });
    }
});

app.get('/api/test-connection', async (req, res) => {
    try {
        const { data, error } = await supabase.from('visitas').select('*').limit(1);
        
        if (error) {
            console.error('Error de conexión a Supabase:', error.message);
            return res.status(500).json({ error: 'Error de conexión a Supabase.' });
        }
        
        res.status(200).json({ message: 'Conexión exitosa a Supabase.', data });
    } catch (error) {
        console.error('Error de servidor:', error.message);
        res.status(500).json({ error: 'Error de servidor.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});