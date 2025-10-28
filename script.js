document.getElementById('carbonForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // 🔌 Constantes (factores de emisión para Perú)
  const TARIFA_LUZ_S_KWH = 0.50; // S/ por kWh (promedio residencial)
  const FACTOR_ELECTRICIDAD = 0.25; // kg CO2/kWh

  // 🚌 Transporte (kg CO2/km)
  const F_AUTO_GASOLINA = 0.192;
  const F_MOTO_GASOLINA = 0.075;
  const F_GNV = 0.140; // Menor que gasolina
  const F_TRANSPORTE_PUBLICO = 0.085;
  // Caminata/bici = 0

  // 🍛 Alimentación (kg CO2/comida)
  const F_MENU_CALLE = 2.5;
  const F_COMIDA_RAPIDA = 3.0;
  const F_COMIDA_CASA = 1.8;

  // 🗑️ Residuos
  const F_RESIDUOS_BASE = 0.6; // kg CO2/kg
  const F_RESIDUOS_SEPARADOS = 0.3;

  // 💻 Digital
  const F_DIGITAL_HORA = 0.02; // kg CO2/hora (estimación conservadora)

  // 📥 Entradas
  const reciboLuz = parseFloat(document.getElementById('reciboLuz').value) || 0;
  const personasCasa = parseInt(document.getElementById('personasCasa').value) || 1;

  const kmAuto = parseFloat(document.getElementById('kmAuto').value) || 0;
  const kmMoto = parseFloat(document.getElementById('kmMoto').value) || 0;
  const kmGNV = parseFloat(document.getElementById('kmGNV').value) || 0;
  const kmPublico = parseFloat(document.getElementById('kmPublico').value) || 0;

  const menuCalle = parseFloat(document.getElementById('menuCalle').value) || 0;
  const comidaRapida = parseFloat(document.getElementById('comidaRapida').value) || 0;
  const comidasCasa = parseFloat(document.getElementById('comidasCasa').value) || 0;
  const dietaVegetariana = document.getElementById('dietaVegetariana').checked;

  const kgResiduos = parseFloat(document.getElementById('kgResiduos').value) || 0;
  const separaResiduos = document.getElementById('separaResiduos').checked;

  const horasPantalla = parseFloat(document.getElementById('horasPantalla').value) || 0;

  // 🔌 Electricidad
  const consumoKWh = reciboLuz / TARIFA_LUZ_S_KWH;
  const emisionLuzTotal = consumoKWh * FACTOR_ELECTRICIDAD;
  const emisionLuz = emisionLuzTotal / personasCasa; // por persona

  // 🚌 Transporte
  const emisionTransporte = 
    kmAuto * F_AUTO_GASOLINA +
    kmMoto * F_MOTO_GASOLINA +
    kmGNV * F_GNV +
    kmPublico * F_TRANSPORTE_PUBLICO;

  // 🍛 Alimentación semanal → mensual
  let emisionAlimentacion = 
    (menuCalle * F_MENU_CALLE) +
    (comidaRapida * F_COMIDA_RAPIDA) +
    (comidasCasa * F_COMIDA_CASA);

  if (dietaVegetariana) {
    emisionAlimentacion *= 0.7; // 30% menos
  }

  const emisionAlimentacionMensual = emisionAlimentacion * 4.33;

  // 🗑️ Residuos
  const factorResiduos = separaResiduos ? F_RESIDUOS_SEPARADOS : F_RESIDUOS_BASE;
  const emisionResiduos = (kgResiduos * 4.33) * factorResiduos;

  // 💻 Digital
  const emisionDigital = horasPantalla * F_DIGITAL_HORA * 30; // mensual

  // 📊 Total
  const totalMensual = 
    emisionLuz + 
    emisionTransporte + 
    emisionAlimentacionMensual + 
    emisionResiduos + 
    emisionDigital;

  const totalAnual = totalMensual * 12;

  // 🌱 Conversión a impacto humano y ecológico
  // 1 árbol absorbe ~22 kg CO₂/año (FAO, promedio en zonas tropicales)
  const arbolesNecesarios = Math.ceil(totalAnual / 22);

  // 1 persona necesita ~740 kg O₂/año → 1 tonelada de CO₂ desplaza oxígeno para ~3 personas (aprox. simplificada)
  const personasSinOxigeno = Math.floor(totalAnual / 1000 * 3);

  // Impacto en agricultura: +1°C reduce rendimiento de maíz en ~7% (IPCC + estudios andinos)
  const aumentoTemp = (totalAnual / 1000000) * 0.00000045; // muy simplificado: 1 ton CO₂ ≈ 0.00000045°C global
  const afectaCultivos = totalAnual > 2000;

  // 📌 Comparación nacional
  const promedioPeru = 2200;
  let comparacion = "";
  if (totalAnual < promedioPeru * 0.7) {
    comparacion = "🌿 Tu huella es <strong>baja</strong> para el promedio peruano.";
  } else if (totalAnual <= promedioPeru * 1.2) {
    comparacion = "✅ Estás cerca del <strong>promedio peruano</strong> (~2,200 kg CO₂/año).";
  } else {
    comparacion = "⚠️ Tu huella está <strong>por encima del promedio</strong> en Perú.";
  }

  // 💡 Recomendaciones personalizadas con impacto estimado
  const recomendaciones = [];

  // --- TRANSPORTE ---
  const kmVehiculo = kmAuto + kmMoto + kmGNV;
  if (kmVehiculo > 150) {
    recomendaciones.push({
      accion: "Usa transporte público 2 veces por semana en lugar de auto/moto",
      impacto: "Podrías reducir ~45 kg CO₂/mes",
      icono: "🚌"
    });
  }
  if (kmAuto > 0) {
    recomendaciones.push({
      accion: "Comparte viajes con compañeros (carpooling)",
      impacto: "Reducirías tu huella de transporte hasta en un 50%",
      icono: "👥"
    });
  }
  if (kmGNV > 0) {
    recomendaciones.push({
      accion: "Sigue usando GNV: es mejor que gasolina. ¡Considera bicicleta para trayectos cortos!",
      impacto: "Mantén tus emisiones bajas (~30% menos que gasolina)",
      icono: "⛽→🚲"
    });
  }

  // --- ALIMENTACIÓN ---
  const comidasFuera = menuCalle + comidaRapida;
  if (comidasFuera >= 8) {
    recomendaciones.push({
      accion: "Prepara 2 comidas en casa usando ingredientes del mercado (papa, arroz, huevo)",
      impacto: "Ahorrarías ~15 kg CO₂/semana y S/30–50",
      icono: "🍲"
    });
  }
  if (menuCalle >= 5 && !dietaVegetariana) {
    recomendaciones.push({
      accion: "Prueba un 'menú veggie' 2 veces por semana (lentejas, frejoles, quinua)",
      impacto: "Reducirías emisiones en ~8 kg CO₂/semana",
      icono: "🥗"
    });
  }

  // --- ELECTRICIDAD ---
  if (reciboLuz > 80) {
    recomendaciones.push({
      accion: "Reemplaza 2 focos incandescentes por LED (cuestan ~S/10 cada uno)",
      impacto: "Ahorro: ~5–8 kg CO₂/mes + S/15 en tu recibo",
      icono: "💡"
    });
  }
  if (reciboLuz > 120) {
    recomendaciones.push({
      accion: "Desconecta electrodomésticos en stand-by (TV, cargadores, laptop)",
      impacto: "Podrías ahorrar hasta 10% de tu consumo eléctrico",
      icono: "🔌"
    });
  }

  // --- RESIDUOS ---
  if (!separaResiduos) {
    recomendaciones.push({
      accion: "Separa plásticos y orgánicos (cáscaras, restos de comida)",
      impacto: "Reducción de ~12 kg CO₂/mes y menos basura en rellenos",
      icono: "♻️"
    });
  }
  if (kgResiduos > 3) {
    recomendaciones.push({
      accion: "Lleva tu vaso/tupper al menú o pollería",
      impacto: "Evitas 10–15 envases plásticos por semana",
      icono: "🥡"
    });
  }

  // --- DIGITAL ---
  if (horasPantalla > 6) {
    recomendaciones.push({
      accion: "Reduce 1 hora diaria de redes sociales",
      impacto: "Menos energía en servidores y en tu celular (~6 kg CO₂/mes)",
      icono: "📵"
    });
  }

  // Si no hay recomendaciones fuertes, dar una general positiva
  if (recomendaciones.length === 0) {
    recomendaciones.push({
      accion: "¡Sigue así! Tu estilo de vida ya es bajo en carbono.",
      impacto: "Eres un ejemplo para otros peruanos 🌱",
      icono: "👏"
    });
  }

  // Limitar a las 3 más relevantes (las primeras)
  const topRecomendaciones = recomendaciones.slice(0, 3);

  const tipsHTML = `
    <h3>✅ Recomendaciones para TI</h3>
    <div class="recomendaciones-lista">
      ${topRecomendaciones.map(r => `
        <div class="recomendacion-item">
          <span class="icono">${r.icono}</span>
          <div>
            <p><strong>${r.accion}</strong></p>
            <p class="impacto">${r.impacto}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // 💭 Mensaje reflexivo (el corazón de tu solicitud)
  let mensajeReflexivo = "";

  if (totalAnual >= 1000) {
    mensajeReflexivo = `
      <div class="impacto-reflexivo">
        <h3>🌍 ¿Qué significa esto en la vida real?</h3>
        <p>Tu huella de carbono anual de <strong>${Math.round(totalAnual)} kg de CO₂</strong> tiene consecuencias reales:</p>
        
        <ul>
          <li>✅ Necesitarías plantar <strong>${arbolesNecesarios} árboles nativos</strong> (como alisos o molles) y cuidarlos por un año solo para compensar tus emisiones.</li>
          
          ${personasSinOxigeno > 0 ? 
            `<li>💨 Esta cantidad de CO₂ reduce la calidad del aire equivalente a quitarle oxígeno limpio a <strong>${personasSinOxigeno} personas</strong> durante un año.</li>` 
            : ''}
          
          ${afectaCultivos ? 
            `<li>🌾 En un país como el Perú, donde millones dependen de la agricultura familiar, emisiones como estas aceleran sequías, heladas y lluvias intensas que <strong>ponen en riesgo la producción de papa, maíz y quinua</strong>.</li>` 
            : ''}
          
          <li>🌡️ Cada tonelada de CO₂ que emitimos suma al calentamiento global. Y en los Andes, el cambio climático ya derrite glaciares que abastecen a ciudades como Lima, Huaraz y Cusco.</li>
        </ul>

        <p><em>Pequeñas acciones suman. Hoy ya diste el primer paso: <strong>conocer tu impacto</strong>.</em></p>
      </div>
    `;
  } else {
    mensajeReflexivo = `
      <div class="impacto-reflexivo">
        <p>🌱 Con una huella tan baja, estás ayudando a proteger los glaciares, los bosques y el aire que respiramos. ¡Gracias por ser parte del cambio!</p>
      </div>
    `;
  }

  // 🖨️ Mostrar resultado completo
  document.getElementById('resultado').innerHTML = `
    <div class="resultado-card">
      <h2>📊 Resultado – Huella de Carbono</h2>
      <p><strong>Mensual:</strong> ${totalMensual.toFixed(1)} kg CO₂</p>
      <p><strong>Anual:</strong> ${totalAnual.toFixed(1)} kg CO₂</p>
      <p>${comparacion}</p>
      <p><small>🌍 Promedio global: ~4,000 kg CO₂/año | Perú: ~2,000–2,500 kg CO₂/año</small></p>
      
      ${tipsHTML}
      
      ${mensajeReflexivo}
    </div>
  `;
});



