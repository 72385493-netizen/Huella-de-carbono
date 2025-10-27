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

  // 💡 Recomendaciones
  const tips = [];
  if (menuCalle + comidaRapida > 10) tips.push("Reducir comidas en la calle reduce emisiones y ahorra dinero.");
  if (kmAuto + kmMoto > 200) tips.push("Considera usar más transporte público o compartir viajes.");
  if (!separaResiduos) tips.push("Separar plásticos y orgánicos puede reducir tu huella en un 30%.");
  if (reciboLuz > 100) tips.push("Revisa el uso de electrodomésticos: apagar en stand-by ahorra luz.");

  const tipsHTML = tips.length > 0 
    ? `<h3>💡 Recomendaciones para ti:</h3><ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>`
    : "<p>¡Estás haciendo un gran trabajo! 👏</p>";

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
