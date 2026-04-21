# Sistema de Evaluación de Elegibilidad para Beneficios Sociales

## Descripción general

Este proyecto implementa un MVP para la gestión de solicitudes de beneficios sociales mediante una arquitectura híbrida:

* **Frontend:** Power Apps
* **Base de datos:** SharePoint
* **Automatizado:** Power Automate
* **Backend:** API REST en Node.js desplegada en Render

El flujo completo permite registrar solicitudes, procesarlas mediante un servicio externo y visualizar los resultados de elegibilidad.

---

## Ejecución local del backend

### 1. Clonar repositorio

```bash
git clone https://github.com/Jul-Fig/RetoTecnico.git
cd RetoTecnico
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar servidor

```bash
node index.js
```

Servidor disponible en:

```bash
http://localhost:3000
```

---

##  URL pública del servicio (Render)

```bash
https://retotecnico.onrender.com/api/beneficio/evaluar
```

 Nota: El servicio en Render (free tier) entra en estado de suspensión tras 15 minutos de inactividad.
La primera petición puede tardar hasta **50 segundos**, por lo que se configuró el timeout en Power Automate a **mínimo 90 segundos**.

---
## Urls del Frontend
### Pantalla 1 Registro de Solicitud:
```bash
https://apps.powerapps.com/play/e/default-2bac32fd-d9a2-40d9-a272-3a35920f5607/a/246afa2c-e685-4850-b7e4-98213b2280f0?tenantId=2bac32fd-d9a2-40d9-a272-3a35920f5607&hint=aa5de372-f417-484e-8c69-7b4da85d620b&sourcetime=1776814301276
```

### Pantalla 2 — Consulta de Solicitudes:
```bash
https://apps.powerapps.com/play/e/default-2bac32fd-d9a2-40d9-a272-3a35920f5607/a/355795ca-47b3-4909-ac9d-5b1dc32dc0ae?tenantId=2bac32fd-d9a2-40d9-a272-3a35920f5607&hint=12cca507-bed4-48a4-a0f2-5c8b08b53db8&sourcetime=1776814301319
```

## Urls de Bases de datos
### Beneficiarios_DB:
```bash
https://soysena-my.sharepoint.com/:l:/g/personal/julian_alozada_soy_sena_edu_co/JACefDcav6JISaHiDeg0Za6wAbWWyAgrgLUyeT7dnoWUqho?e=E2s1O3
```

### Solicitudes_Beneficio
```bash
https://soysena-my.sharepoint.com/:l:/g/personal/julian_alozada_soy_sena_edu_co/JAA6l2QauiyRQIWNh8DeY3ADAeTPwu5rrFqfzqR2jRIlcrA?e=ToCT4P
```
## Flujos de trabajo
En la carpeta raiz se encuentran el flujo de Generación de Folio: y el flujo deConsumo del Servicio Externo

## Flujo de funcionamiento

1. Usuario registra solicitud en Power Apps
2. Se guarda en SharePoint (`Solicitudes_Beneficio`)
3. Flujo A genera el folio automáticamente
4. Flujo B envía los datos al servicio externo
5. API evalúa elegibilidad
6. SharePoint se actualiza con el resultado
7. Pantalla de consulta muestra solicitudes procesadas

---

## Reglas de negocio implementadas

El sistema calcula un **score de elegibilidad** basado en las siguientes reglas:

* Ingresos ≤ 1.000.000 → +30 puntos
* Ingresos entre 1.000.001 y 2.000.000 → +15 puntos
* Estrato ≤ 2 → +25 puntos
* Núcleo familiar ≥ 4 → +20 puntos
* Edad > 60 años → +15 puntos
* Beneficio tipo "Vivienda" y estrato ≤ 2 → +10 puntos adicionales

### Clasificación final:

* **Score ≥ 60** → Aprobado
* **Score entre 30 y 59** → En revisión
* **Score < 30** → Rechazado

---

## Validaciones implementadas

* Ingresos ≤ 0 → error HTTP 400
* Estrato fuera de rango (1–6) → error HTTP 400
* Campos obligatorios faltantes → error HTTP 400

---

## Simulación de procesamiento

El servicio implementa un retardo artificial:

```javascript
sconst delay = Math.floor(Math.random() * 3000) + 3000;
```

Esto simula un proceso real asincrónico.

---

## Argumentación técnica

### Uso de arquitectura híbrida

Se separa la lógica de negocio en un backend independiente, permitiendo escalabilidad y desacoplamiento del frontend.

### Uso de Power Automate

Se implementaron dos flujos:

* Generación automática de folio
* Integración con servicio externo mediante HTTP

### - Manejo de datos nulos

Se utilizaron expresiones WDL como `coalesce()` para garantizar robustez ante datos incompletos.

### - Control de ejecución

Se utilizó el campo `Procesado` para evitar ejecuciones recursivas (loops infinitos) en el flujo.

### - Evaluación basada en reglas

Se implementó un arreglo de objetos con reglas dinámicas, iterado mediante un bucle `for`, facilitando escalabilidad y mantenimiento.

### - Timeout y resiliencia

Se configuró un timeout ≥ 90 segundos en Power Automate debido a la latencia del free tier de Render.

---

##  Mejoras futuras

* Implementar autenticación en API
* Optimizar consultas en Power Apps

---

##  Estado del proyecto

✔ Flujo completo funcional end-to-end
✔ Integración Power Apps + Power Automate + API
✔ Datos de prueba cargados
✔ Backend desplegado en Render

---
