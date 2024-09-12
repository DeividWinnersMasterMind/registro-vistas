require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.get('/api/registrar-visita', async (req, res) => {
    try {
        const nuevaVisita = {
            ip: req.ip,
            user_agent: req.get('User-Agent'),
            fecha: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('visitas')
            .insert([nuevaVisita]);

        if (error) {
            console.error('Error al registrar la visita:', error.message);
            return res.status(500).json({ error: 'Error al registrar la visita.' });
        }

        res.status(201).json({ message: 'Visita registrada correctamente.', data });
    } catch (error) {
        console.error('Error al registrar la visita:', error.message);
        res.status(500).json({ error: 'Error al registrar la visita.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});