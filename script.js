// Cambiar pestaña
function cambiarPestaña(tipo) {
  document.getElementById('tabCarbono').classList.toggle('active', tipo === 'carbono');
  document.getElementById('tabHidrica').classList.toggle('active', tipo === 'hidrica');
  document.getElementById('carbonForm').classList.toggle('activo', tipo === 'carbono');
  document.getElementById('waterForm').classList.toggle('activo', tipo === 'hidrica');
  document.getElementById('resultado').innerHTML = '';
}

// 🌍 CALCULADORA DE HUELLA DE CARBONO (COMPLETA)
document.getElementById('carbonForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // 🔌 Constantes
  const TARIFA_LUZ_S_KWH = 0.50;
  const FACTOR_ELECTRICIDAD = 0.25;
  const F_AUTO_GASOLINA = 0.192;
  const F_MOTO_GASOLINA = 0.075;
  const F_GNV = 0.140;
  const F_TRANSPORTE_PUBLICO = 0.085;
  const F_MENU_CALLE = 2.5;
  const F_COMIDA_RAPIDA = 3.0;
  const F_COMIDA_CASA = 1.8;
  const F_RESIDUOS_BASE = 0.6;
  const F_RESIDUOS_SEPARADOS = 0.3;
  const F_DIGITAL_HORA = 0.02;

  // 📥 Entradas (con sufijo C)
  const reciboLuz = parseFloat(document.getElementById('reciboLuzC').value) || 0;
  const personasCasa = parseInt(document.getElementById('personasCasaC').value) || 1;
  const kmAuto = parseFloat(document.getElementById('kmAutoC').value) || 0;
  const kmMoto = parseFloat(document.getElementById('kmMotoC').value) || 0;
  const kmGNV = parseFloat(document.getElementById('kmGNVC').value) || 0;
  const kmPublico = parseFloat(document.getElementById('kmPublicoC').value) || 0;
  const menuCalle = parseFloat(document.getElementById('menuCalleC').value) || 0;
  const comidaRapida = parseFloat(document.getElementById('comidaRapidaC').value) || 0;
  const comidasCasa = parseFloat(document.getElementById('comidasCasaC').value) || 0;
  const dietaVegetariana = document.getElementById('dietaVegetarianaC').checked;
  const kgResiduos = parseFloat(document.getElementById('kgResiduosC').value) || 0;
  const separaResiduos = document.getElementById('separaResiduosC').checked;
  const horasPantalla = parseFloat(document.getElementById('horasPantallaC').value) || 0;

  // 🔌 Cálculos
  const consumoKWh = reciboLuz / TARIFA_LUZ_S_KWH;
  const emisionLuzTotal = consumoKWh * FACTOR_ELECTRICIDAD;
  const emisionLuz = emisionLuzTotal / personasCasa;

  const emisionTransporte = 
    kmAuto * F_AUTO_GASOLINA +
    kmMoto * F_MOTO_GASOLINA +
    kmGNV * F_GNV +
    kmPublico * F_TRANSPORTE_PUBLICO;

  let emisionAlimentacion = 
    (menuCalle * F_MENU_CALLE) +
    (comidaRapida * F_COMIDA_RAPIDA) +
    (comidasCasa * F_COMIDA_CASA);
  if (dietaVegetariana) emisionAlimentacion *= 0.7;
  const emisionAlimentacionMensual = emisionAlimentacion * 4.33;

  const factorResiduos = separaResiduos ? F_RESIDUOS_SEPARADOS : F_RESIDUOS_BASE;
  const emisionResiduos = (kgResiduos * 4.33) * factorResiduos;

  const emisionDigital = horasPantalla * F_DIGITAL_HORA * 30;

  const totalMensual = emisionLuz + emisionTransporte + emisionAlimentacionMensual + emisionResiduos + emisionDigital;
  const totalAnual = totalMensual * 12;

  // 💡 Recomendaciones personalizadas (carbono)
  const recomendacionesC = [];
  if (menuCalle + comidaRapida > 10) recomendacionesC.push({ accion: "Reducir comidas en la calle", impacto: "Reduce emisiones y ahorra dinero", icono: "🍲" });
  if (kmAuto + kmMoto > 200) recomendacionesC.push({ accion: "Usa más transporte público o comparte viajes", impacto: "Menos emisiones y ahorro en combustible", icono: "🚌" });
  if (!separaResiduos) recomendacionesC.push({ accion: "Separa plásticos y orgánicos", impacto: "Reduce tu huella en un 30%", icono: "♻️" });
  if (reciboLuz > 100) recomendacionesC.push({ accion: "Revisa el uso de electrodomésticos", impacto: "Apagar en stand-by ahorra luz", icono: "🔌" });
  if (recomendacionesC.length === 0) recomendacionesC.push({ accion: "¡Estás haciendo un gran trabajo!", impacto: "Tu estilo de vida es bajo en carbono", icono: "👏" });

  const topRecC = recomendacionesC.slice(0, 3);
  const recomendacionesHTMLC = `
    <h3>💡 Recomendaciones para TI</h3>
    <div class="recomendaciones-lista">
      ${topRecC.map(r => `
        <div class="recomendacion-item">
          <span class="icono">${r.icono}</span>
          <div><p><strong>${r.accion}</strong></p><p class="impacto">${r.impacto}</p></div>
        </div>
      `).join('')}
    </div>
  `;

  // 🌍 Comparación
  const promedioPeruC = 2200;
  let comparacionC = "";
  if (totalAnual < promedioPeruC * 0.7) {
    comparacionC = "🌿 Tu huella es <strong>baja</strong> para el promedio peruano.";
  } else if (totalAnual <= promedioPeruC * 1.2) {
    comparacionC = "✅ Estás cerca del <strong>promedio peruano</strong> (~2,200 kg CO₂/año).";
  } else {
    comparacionC = "⚠️ Tu huella está <strong>por encima del promedio</strong> en Perú.";
  }

  // 💭 Impacto reflexivo (carbono)
  const arbolesNecesarios = Math.ceil(totalAnual / 22);
  const personasSinOxigeno = Math.floor(totalAnual / 1000 * 3);
  const afectaCultivos = totalAnual > 2000;

  let mensajeReflexivoC = `
    <div class="impacto-reflexivo">
      <h3>🌍 ¿Qué significa esto en la vida real?</h3>
      <p>Tu huella de carbono anual de <strong>${Math.round(totalAnual)} kg de CO₂</strong> tiene consecuencias reales:</p>
      <ul>
        <li>✅ Necesitarías plantar <strong>${arbolesNecesarios} árboles nativos</strong> para compensar tus emisiones.</li>
        ${personasSinOxigeno > 0 ? `<li>💨 Esta cantidad de CO₂ reduce la calidad del aire equivalente a quitarle oxígeno limpio a <strong>${personasSinOxigeno} personas</strong> durante un año.</li>` : ''}
        ${afectaCultivos ? `<li>🌾 En Perú, emisiones como estas aceleran sequías y lluvias intensas que <strong>ponen en riesgo la producción de papa, maíz y quinua</strong>.</li>` : ''}
        <li>🌡️ En los Andes, el cambio climático ya derrite glaciares que abastecen a ciudades como Lima, Huaraz y Cusco.</li>
      </ul>
      <p><em>Pequeñas acciones suman. Hoy ya diste el primer paso: <strong>conocer tu impacto</strong>.</em></p>
    </div>
  `;

  // 🖨️ Mostrar resultado
  document.getElementById('resultado').innerHTML = `
    <div class="resultado-card">
      <h2>📊 Resultado – Huella de Carbono</h2>
      <p><strong>Mensual:</strong> ${totalMensual.toFixed(1)} kg CO₂</p>
      <p><strong>Anual:</strong> ${totalAnual.toFixed(1)} kg CO₂</p>
      <p>${comparacionC}</p>
      <p><small>🌍 Promedio global: ~4,000 kg CO₂/año | Perú: ~2,000–2,500 kg CO₂/año</small></p>
      ${recomendacionesHTMLC}
      ${mensajeReflexivoC}
    </div>
  `;
});

// 💧 CALCULADORA DE HUELLA HÍDRICA (COMPLETA)
document.getElementById('waterForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // 💧 Factores corregidos
  const FACTOR_DUCHA = 10;
  const FACTOR_LAVADO_ROPA = 80;
  const FACTOR_CARNE = 1500;
  const FACTOR_ARROZ_FIDEOS = 250;
  const FACTOR_PAPA = 150;
  const FACTOR_QUINUA = 90;
  const FACTOR_COMIDA_CALLE = 800;
  const FACTOR_BOTELLA_PLASTICO = 150;
  const FACTOR_PAPEL = 10;
  const FACTOR_PRENDA_ROPA = 2500;
  const TARIFA_LUZ_S_KWH = 0.50;
  const FACTOR_AGUA_ELECTRICIDAD = 1.0;

  // 📥 Entradas (con sufijo H)
  const duchaMin = parseFloat(document.getElementById('duchaMinH').value) || 0;
  const lavadoRopa = parseFloat(document.getElementById('lavadoRopaH').value) || 0;
  const porcionesCarne = parseFloat(document.getElementById('porcionesCarneH').value) || 0;
  const porcionesArroz = parseFloat(document.getElementById('porcionesArrozH').value) || 0;
  const porcionesPapa = parseFloat(document.getElementById('porcionesPapaH').value) || 0;
  const porcionesQuinua = parseFloat(document.getElementById('porcionesQuinuaH').value) || 0;
  const comidasCalle = parseFloat(document.getElementById('comidasCalleH').value) || 0;
  const botellasPlastico = parseFloat(document.getElementById('botellasPlasticoH').value) || 0;
  const hojasPapel = parseFloat(document.getElementById('hojasPapelH').value) || 0;
  const prendasRopa = parseFloat(document.getElementById('prendasRopaH').value) || 0;
  const reciboLuz = parseFloat(document.getElementById('reciboLuzH').value) || 0;

  // 💧 Cálculos
  const aguaDucha = duchaMin * FACTOR_DUCHA;
  const aguaRopaDiaria = (lavadoRopa * FACTOR_LAVADO_ROPA) / 7;
  const aguaAlimentacion = 
    porcionesCarne * FACTOR_CARNE +
    porcionesArroz * FACTOR_ARROZ_FIDEOS +
    porcionesPapa * FACTOR_PAPA +
    porcionesQuinua * FACTOR_QUINUA +
    comidasCalle * FACTOR_COMIDA_CALLE;
  const aguaConsumoDiario = 
    (botellasPlastico * FACTOR_BOTELLA_PLASTICO) / 7 +
    (hojasPapel * FACTOR_PAPEL) / 7 +
    (prendasRopa * FACTOR_PRENDA_ROPA) / 30;
  const consumoKWh = reciboLuz / TARIFA_LUZ_S_KWH;
  const aguaElectricidadDiaria = (consumoKWh * FACTOR_AGUA_ELECTRICIDAD) / 30;
  const totalDiario = aguaDucha + aguaRopaDiaria + aguaAlimentacion + aguaConsumoDiario + aguaElectricidadDiaria;
  const totalAnual = totalDiario * 365;

  // 💡 Recomendaciones personalizadas (hídrica) – versión ampliada
  const recomendacionesH = [];
  if (duchaMin > 12) recomendacionesH.push({ accion: "Reduce tu ducha a 8 minutos", impacto: "Ahorrarías ~40 L/día → ¡14,600 L al año!", icono: "🚿", prioridad: 10 });
  else if (duchaMin > 8) recomendacionesH.push({ accion: "Cierra la ducha mientras te enjabonas", impacto: "Ahorras 20–30 L por ducha", icono: "🧼", prioridad: 9 });
  if (lavadoRopa >= 4) recomendacionesH.push({ accion: "Lava ropa solo con carga completa", impacto: "Ahorras hasta 40 L por lavado", icono: "👕", prioridad: 8 });
  if (porcionesCarne >= 3) recomendacionesH.push({ accion: "Prueba el 'lunes sin carne'", impacto: "Una porción menos = 1,500 L ahorrados", icono: "🥗", prioridad: 10 });
  else if (porcionesCarne >= 1) recomendacionesH.push({ accion: "Elige pollo en lugar de carne de res", impacto: "El pollo usa 3 veces menos agua", icono: "🍗", prioridad: 8 });
  if (comidasCalle >= 3) recomendacionesH.push({ accion: "Lleva tu tupper al menú", impacto: "Evitas empaques y ahorras ~200 L/comida", icono: "🥡", prioridad: 9 });
  if (botellasPlastico >= 3) recomendacionesH.push({ accion: "Compra un botellón de 5L", impacto: "Ahorras dinero y evitas 15 botellas/semana", icono: "🚰", prioridad: 9 });
  if (prendasRopa >= 2) recomendacionesH.push({ accion: "Participa en trueques de ropa", impacto: "Una prenda reutilizada = 2,500 L ahorrados", icono: "🔄", prioridad: 8 });
  if (totalDiario > 3000) recomendacionesH.push({ accion: "Instala un regulador de caudal en tu ducha", impacto: "Reduce el flujo en un 30%", icono: "🚿↓", prioridad: 9 });
  if (recomendacionesH.length === 0) recomendacionesH.push({ accion: "¡Tu huella hídrica es muy baja!", impacto: "Gracias por cuidar el agua del Perú 🌿", icono: "👏", prioridad: 10 });

  recomendacionesH.sort((a, b) => b.prioridad - a.prioridad);
  const topRecH = recomendacionesH.slice(0, 3);
  const recomendacionesHTMLH = `
    <h3>💧 Recomendaciones para TI</h3>
    <div class="recomendaciones-lista">
      ${topRecH.map(r => `
        <div class="recomendacion-item">
          <span class="icono">${r.icono}</span>
          <div><p><strong>${r.accion}</strong></p><p class="impacto">${r.impacto}</p></div>
        </div>
      `).join('')}
    </div>
  `;

  // 🌍 Comparación
  const promedioPeruH = 2500;
  let comparacionH = "";
  if (totalDiario < promedioPeruH * 0.8) {
    comparacionH = "💧 Tu huella hídrica es <strong>baja</strong> para el promedio peruano.";
  } else if (totalDiario <= promedioPeruH * 1.2) {
    comparacionH = "✅ Estás cerca del <strong>promedio peruano</strong> (~2,500 L/día).";
  } else {
    comparacionH = "⚠️ Tu huella hídrica está <strong>por encima del promedio</strong> en Perú.";
  }

  // 💭 Impacto reflexivo (hídrica)
  const diasSinAgua = Math.floor(totalAnual / 100);
  const mensajeReflexivoH = `
    <div class="impacto-reflexivo">
      <h3>💧 ¿Qué significa esto?</h3>
      <p>Tu huella hídrica diaria de <strong>${Math.round(totalDiario)} litros</strong> equivale a:</p>
      <ul>
        <li>🚰 <strong>${(totalDiario / 250).toFixed(1)} veces</strong> el consumo promedio en Lima (250 L/día).</li>
        <li>🌍 En un año, usas <strong>${Math.round(totalAnual).toLocaleString()} litros</strong> —equivalente al <strong>mínimo vital de ${diasSinAgua} días</strong> para una persona.</li>
        <li>🏔️ En Perú, el 70% del agua dulce se usa en agricultura. Cada porción de carne = 3 duchas.</li>
        <li>⚠️ En la costa, el estrés hídrico aumenta. Ahorrar agua es elegir mejor tus alimentos y productos.</li>
      </ul>
      <p><em>El agua no se "acaba", pero el agua <strong>limpia y accesible</strong> sí. Tú puedes marcar la diferencia.</em></p>
    </div>
  `;

  // 🖨️ Mostrar resultado
  document.getElementById('resultado').innerHTML = `
    <div class="resultado-card">
      <h2>📊 Resultado – Huella Hídrica</h2>
      <p><strong>Diaria:</strong> ${Math.round(totalDiario)} litros</p>
      <p><strong>Anual:</strong> ${Math.round(totalAnual).toLocaleString()} litros</p>
      <p>${comparacionH}</p>
      <p><small>🌍 Promedio global: ~3,800 L/día | Perú: ~2,000–2,800 L/día</small></p>
      ${recomendacionesHTMLH}
      ${mensajeReflexivoH}
    </div>
  `;
});