const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/beneficio/evaluar', (req, res) => {
  const {
    solicitudId,
    tipoBeneficio,
    ingresosMensuales,
    estrato,
    nucleoFamiliar,
    fechaNacimiento
  } = req.body;

  //  Validaciones
  if (!solicitudId || !tipoBeneficio || ingresosMensuales == null || estrato == null || !nucleoFamiliar || !fechaNacimiento) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (ingresosMensuales <= 0) {
    return res.status(400).json({ error: 'Ingresos inválidos' });
  }

  if (estrato < 1 || estrato > 6) {
    return res.status(400).json({ error: 'Estrato inválido' });
  }

  // Calcular edad
  const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();

  //  Reglas
  const reglas = [
    {
      condicion: () => ingresosMensuales <= 1000000,
      puntos: 30,
      descripcion: 'Ingresos <= 1M'
    },
    {
      condicion: () => ingresosMensuales > 1000000 && ingresosMensuales <= 2000000,
      puntos: 15,
      descripcion: 'Ingresos entre 1M y 2M'
    },
    {
      condicion: () => estrato <= 2,
      puntos: 25,
      descripcion: 'Estrato bajo'
    },
    {
      condicion: () => nucleoFamiliar >= 4,
      puntos: 20,
      descripcion: 'Familia numerosa'
    },
    {
      condicion: () => edad > 60,
      puntos: 15,
      descripcion: 'Mayor de 60 años'
    },
    {
      condicion: () => tipoBeneficio === 'Vivienda' && estrato <= 2,
      puntos: 10,
      descripcion: 'Bono adicional vivienda'
    }
  ];

  // Cálculo del score con FOR
  let score = 0;
  let motivos = [];

  for (let i = 0; i < reglas.length; i++) {
    if (reglas[i].condicion()) {
      score += reglas[i].puntos;
      motivos.push(reglas[i].descripcion);
    }
  }

  // Estado final
  let estado;

  if (score >= 60) {
    estado = 'Aprobado';
  } else if (score >= 30) {
    estado = 'En revisión';
  } else {
    estado = 'Rechazado';
  }

  //  Log 
  console.log({
    solicitudId,
    tipoBeneficio,
    timestamp: new Date()
  });

  // 🔹  async
  const delay = Math.floor(Math.random() * 3000) + 3000;

  setTimeout(() => {
    res.json({
      solicitudId,
      score,
      estado,
      motivoDecision: motivos.join(', ')
    });
  }, delay);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
