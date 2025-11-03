// Cambiar pestaña
function cambiarPestaña(tipo) {
  document.getElementById('tabCarbono').classList.toggle('active', tipo === 'carbono');
  document.getElementById('tabHidrica').classList.toggle('active', tipo === 'hidrica');
  document.getElementById('tabCircular').classList.toggle('active', tipo === 'circular');
  
  document.getElementById('carbonForm').classList.toggle('activo', tipo === 'carbono');
  document.getElementById('waterForm').classList.toggle('activo', tipo === 'hidrica');
  document.getElementById('circularForm').classList.toggle('activo', tipo === 'circular');
  
  document.getElementById('resultado').innerHTML = '';
}

// 🌍 HUELLA DE CARBONO – con retroalimentación ampliada
document.getElementById('carbonForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Entradas
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
  const dni = document.getElementById('dniC').value;
  const sexo = document.getElementById('sexoC').value;
  const carrera = document.getElementById('carreraC').value;

  // Factores
  const TARIFA_LUZ = 0.50;
  const FACTOR_ELECTRICIDAD = 0.25;
  const F_AUTO = 0.192, F_MOTO = 0.075, F_GNV = 0.140, F_PUBLICO = 0.085;
  const F_MENU = 2.5, F_RAPIDA = 3.0, F_CASA = 1.8;
  const F_RESIDUOS = separaResiduos ? 0.3 : 0.6;
  const F_DIGITAL = 0.02;

  // Cálculos
  const kWh = reciboLuz / TARIFA_LUZ;
  const emisionLuz = (kWh * FACTOR_ELECTRICIDAD) / personasCasa;
  const emisionTrans = kmAuto*F_AUTO + kmMoto*F_MOTO + kmGNV*F_GNV + kmPublico*F_PUBLICO;
  let emisionAlim = menuCalle*F_MENU + comidaRapida*F_RAPIDA + comidasCasa*F_CASA;
  if (dietaVegetariana) emisionAlim *= 0.7;
  const emisionRes = (kgResiduos * 4.33) * F_RESIDUOS;
  const emisionDig = horasPantalla * F_DIGITAL * 30;
  const totalMensual = emisionLuz + emisionTrans + emisionAlim*4.33 + emisionRes + emisionDig;
  const totalAnual = totalMensual * 12;

  // Determinar perfil para recomendaciones
  let perfilCarbono = "general";
  if (carrera.toLowerCase().includes("estudiante") || carrera.toLowerCase().includes("universit")) {
    perfilCarbono = "estudiante";
  } else if (carrera.toLowerCase().includes("oficina") || carrera.toLowerCase().includes("administr")) {
    perfilCarbono = "trabajador";
  } else if (carrera.toLowerCase().includes("ama de casa") || carrera.toLowerCase().includes("hogar")) {
    perfilCarbono = "amaCasa";
  } else if (carrera.toLowerCase().includes("emprend")) {
    perfilCarbono = "emprendedor";
  } else if (carrera.toLowerCase().includes("agricult") || carrera.toLowerCase().includes("campo")) {
    perfilCarbono = "rural";
  }

  // Recomendaciones ampliadas por perfil
  const recCarbono = [];

  if (menuCalle + comidaRapida > 8) {
    const ejemplos = {
      estudiante: "Prepara lunch en casa con papa y huevo; ahorras S/20/semana y 5 kg CO₂.",
      trabajador: "Lleva tu comida en tupper; muchos edificios tienen microondas.",
      amaCasa: "Cocina porciones grandes y congela; evitas pedir delivery.",
      emprendedor: "Ofrece menús veganos en tu negocio; son más económicos y bajos en carbono.",
      rural: "Consume lo que produces; reduce transporte y empaques."
    };
    recCarbono.push(`Reducir comidas en la calle: ${ejemplos[perfilCarbono] || ejemplos.estudiante}`);
  }

  if (kmAuto + kmMoto > 200) {
    const ejemplos = {
      estudiante: "Usa el Metropolitano o combi; muchos estudiantes tienen tarifa escolar.",
      trabajador: "Comparte viaje con colegas; ahorran en gasolina y estacionamiento.",
      amaCasa: "Combina recados en un solo viaje; planifica tu ruta semanal.",
      emprendedor: "Usa delivery colectivo para tus productos; reduce viajes individuales.",
      rural: "Usa transporte colectivo rural; fortalece la economía local."
    };
    recCarbono.push(`Reducir uso de vehículo particular: ${ejemplos[perfilCarbono] || ejemplos.estudiante}`);
  }

  if (!separaResiduos) {
    const ejemplos = {
      estudiante: "Separa plásticos en tu pensión; muchos campus tienen puntos de reciclaje.",
      trabajador: "Organiza un sistema de reciclaje en tu oficina.",
      amaCasa: "Separa orgánicos para compost y plásticos para recicladores de base.",
      emprendedor: "Diseña empaques retornables o reciclables.",
      rural: "Haz compost comunitario; mejora la fertilidad del suelo."
    };
    recCarbono.push(`Separar residuos: ${ejemplos[perfilCarbono] || ejemplos.estudiante}`);
  }

  if (recCarbono.length === 0) {
    recCarbono.push("¡Tu huella de carbono es muy baja! Eres un ejemplo de sostenibilidad.");
  }

  const recomendacionesHTMLC = `
    <h3>💡 Recomendaciones personalizadas</h3>
    <ul>${recCarbono.map(r => `<li>${r}</li>`).join('')}</ul>
  `;

  // Comparación
  const promedioPeruC = 2200;
  let comparacionC = "";
  if (totalAnual < promedioPeruC * 0.7) {
    comparacionC = "🌿 Tu huella es <strong>baja</strong> para el promedio peruano.";
  } else if (totalAnual <= promedioPeruC * 1.2) {
    comparacionC = "✅ Estás cerca del <strong>promedio peruano</strong> (~2,200 kg CO₂/año).";
  } else {
    comparacionC = "⚠️ Tu huella está <strong>por encima del promedio</strong> en Perú.";
  }

  // Impacto reflexivo
  const arbolesNecesarios = Math.ceil(totalAnual / 22);
  const personasSinOxigeno = Math.floor(totalAnual / 1000 * 3);
  const afectaCultivos = totalAnual > 2000;

  let mensajeReflexivoC = `
    <div class="impacto-reflexivo">
      <h3>🌍 ¿Qué significa esto en la vida real?</h3>
      <p>Tu huella de carbono anual de <strong>${Math.round(totalAnual)} kg de CO₂</strong> tiene consecuencias reales:</p>
      <ul>
        <li>✅ Necesitarías plantar <strong>${arbolesNecesarios} árboles nativos</strong> (molles, alisos) para compensar.</li>
        ${personasSinOxigeno > 0 ? `<li>💨 Esta cantidad de CO₂ reduce la calidad del aire equivalente a quitarle oxígeno limpio a <strong>${personasSinOxigeno} personas</strong> durante un año.</li>` : ''}
        ${afectaCultivos ? `<li>🌾 En Perú, emisiones como estas aceleran sequías y lluvias intensas que <strong>ponen en riesgo la producción de papa, maíz y quinua</strong>.</li>` : ''}
        <li>🌡️ En los Andes, el cambio climático ya derrite glaciares que abastecen a ciudades como Lima, Huaraz y Cusco.</li>
      </ul>
      <p><em>Pequeñas acciones suman. Hoy ya diste el primer paso: <strong>conocer tu impacto</strong>.</em></p>
    </div>
  `;

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

// 💧 HUELLA HÍDRICA – con retroalimentación ampliada
document.getElementById('waterForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Entradas
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
  const dni = document.getElementById('dniH').value;
  const sexo = document.getElementById('sexoH').value;
  const carrera = document.getElementById('carreraH').value;

  // Factores
  const FACTOR_DUCHA = 10, FACTOR_LAVADO = 80;
  const FACTOR_CARNE = 1500, FACTOR_ARROZ = 250, FACTOR_PAPA = 150, FACTOR_QUINUA = 90, FACTOR_CALLE = 800;
  const FACTOR_BOTELLA = 150, FACTOR_PAPEL = 10, FACTOR_ROPA = 2500;
  const TARIFA = 0.50, FACTOR_ELECT = 1.0;

  // Cálculos
  const aguaDucha = duchaMin * FACTOR_DUCHA;
  const aguaRopa = (lavadoRopa * FACTOR_LAVADO) / 7;
  const aguaAlim = porcionesCarne*FACTOR_CARNE + porcionesArroz*FACTOR_ARROZ + porcionesPapa*FACTOR_PAPA + porcionesQuinua*FACTOR_QUINUA + comidasCalle*FACTOR_CALLE;
  const aguaCons = (botellasPlastico*FACTOR_BOTELLA)/7 + (hojasPapel*FACTOR_PAPEL)/7 + (prendasRopa*FACTOR_ROPA)/30;
  const aguaElec = ((reciboLuz / TARIFA) * FACTOR_ELECT) / 30;
  const totalDiario = aguaDucha + aguaRopa + aguaAlim + aguaCons + aguaElec;
  const totalAnual = totalDiario * 365;

  // Determinar perfil
  let perfilHidrico = "general";
  if (carrera.toLowerCase().includes("estudiante") || carrera.toLowerCase().includes("universit")) {
    perfilHidrico = "estudiante";
  } else if (carrera.toLowerCase().includes("oficina") || carrera.toLowerCase().includes("administr")) {
    perfilHidrico = "trabajador";
  } else if (carrera.toLowerCase().includes("ama de casa") || carrera.toLowerCase().includes("hogar")) {
    perfilHidrico = "amaCasa";
  } else if (carrera.toLowerCase().includes("emprend")) {
    perfilHidrico = "emprendedor";
  } else if (carrera.toLowerCase().includes("agricult") || carrera.toLowerCase().includes("campo")) {
    perfilHidrico = "rural";
  }

  // Recomendaciones ampliadas
  const recHidrica = [];

  if (duchaMin > 10) {
    const ejemplos = {
      estudiante: "Cierra la ducha al enjabonarte; ahorras 20 L por ducha sin esfuerzo.",
      trabajador: "Instala un regulador de caudal en tu ducha (cuesta ~S/15).",
      amaCasa: "Reutiliza el agua de lavar ropa para trapear o regar plantas.",
      emprendedor: "Instala sistemas de agua eficientes en tu negocio.",
      rural: "Captura agua de lluvia para uso doméstico o riego."
    };
    recHidrica.push(`Reducir tiempo de ducha: ${ejemplos[perfilHidrico] || ejemplos.estudiante}`);
  }

  if (porcionesCarne >= 2) {
    const ejemplos = {
      estudiante: "Prueba menús con frejoles o lentejas; son más baratos y usan menos agua.",
      trabajador: "Elige pollo en lugar de carne de res; ahorras 70% de agua.",
      amaCasa: "Prepara caldos con sobras de carne; rinde más y usa menos agua.",
      emprendedor: "Ofrece opciones vegetarianas en tu menú; atraes a más clientes.",
      rural: "Cria animales de bajo consumo hídrico como cuyes o aves."
    };
    recHidrica.push(`Reducir consumo de carne: ${ejemplos[perfilHidrico] || ejemplos.estudiante}`);
  }

  if (botellasPlastico >= 2) {
    const ejemplos = {
      estudiante: "Lleva una botella reutilizable al campus; muchos tienen bebederos.",
      trabajador: "Compra un botellón de 5L y rellena tu botella en la oficina.",
      amaCasa: "Usa jarras de agua en casa; evitas botellas plásticas semanales.",
      emprendedor: "Ofrece descuentos a clientes que traigan su vaso reutilizable.",
      rural: "Usa recipientes de vidrio o acero para almacenar agua."
    };
    recHidrica.push(`Reducir botellas plásticas: ${ejemplos[perfilHidrico] || ejemplos.estudiante}`);
  }

  if (recHidrica.length === 0) {
    recHidrica.push("¡Tu consumo de agua es muy consciente! Gracias por cuidar el agua del Perú.");
  }

  const recomendacionesHTMLH = `
    <h3>💧 Recomendaciones personalizadas</h3>
    <ul>${recHidrica.map(r => `<li>${r}</li>`).join('')}</ul>
  `;

  // Comparación
  const promedioPeruH = 2500;
  let comparacionH = "";
  if (totalDiario < promedioPeruH * 0.8) {
    comparacionH = "💧 Tu huella hídrica es <strong>baja</strong> para el promedio peruano.";
  } else if (totalDiario <= promedioPeruH * 1.2) {
    comparacionH = "✅ Estás cerca del <strong>promedio peruano</strong> (~2,500 L/día).";
  } else {
    comparacionH = "⚠️ Tu huella hídrica está <strong>por encima del promedio</strong> en Perú.";
  }

  // Impacto reflexivo
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

// ♻️ ECONOMÍA CIRCULAR – con perfil
document.getElementById('circularForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const getValor = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value) : 0;
  };

  const refuseRethink = getValor('rechazar') + getValor('repensar');
  const reduce = getValor('reduceCompras') + getValor('reduceEnergia');
  const reuseRepurpose = getValor('reutiliza') + getValor('reutilizaNuevo');
  const repairRefurbish = getValor('reparar') + getValor('restaurar');
  const recycleRecover = getValor('reciclar') + getValor('compostar');
  const perfil = document.querySelector('input[name="perfilCircular"]:checked')?.value || 'estudiante';

  const total = refuseRethink + reduce + reuseRepurpose + repairRefurbish + recycleRecover;
  const maximo = 30;
  const indice = Math.round((total / maximo) * 100);

  // Retroalimentación por categoría
  const feedback = [];

  if (refuseRethink < 4) {
    feedback.push({
      r: "Rechazar y Repensar",
      ejemplos: {
        estudiante: "Di 'no gracias' a los flyers en la calle y lleva tu propia botella al campus.",
        trabajador: "Evita los vasos desechables en la oficina; lleva tu taza reutilizable.",
        amaCasa: "Compra sin sobreempaque en el mercado; rechaza las bolsas plásticas.",
        emprendedor: "Ofrece tus productos sin empaque o con materiales reutilizables.",
        rural: "Usa recipientes propios al comprar en ferias; rechaza plásticos de un solo uso."
      }
    });
  }

  if (reduce < 4) {
    feedback.push({
      r: "Reducir",
      ejemplos: {
        estudiante: "Comparte libros de texto con compañeros en vez de comprar nuevos.",
        trabajador: "Imprime solo lo esencial; usa documentos digitales.",
        amaCasa: "Planifica tus compras para evitar desperdicios de comida.",
        emprendedor: "Diseña productos duraderos que no necesiten reemplazo constante.",
        rural: "Usa abono natural en vez de agroquímicos; reduce insumos externos."
      }
    });
  }

  if (reuseRepurpose < 4) {
    feedback.push({
      r: "Reutilizar y Reutilizar con nuevo fin",
      ejemplos: {
        estudiante: "Usa frascos de vidrio como portalápices o macetas para hierbas.",
        trabajador: "Lleva tu lunch en tupper y tu café en termo.",
        amaCasa: "Convierte camisetas viejas en trapos de limpieza o bolsas de tela.",
        emprendedor: "Crea productos con materiales recuperados (plástico, textiles).",
        rural: "Reutiliza bidones para almacenar agua o como macetas para huertos."
      }
    });
  }

  if (repairRefurbish < 4) {
    feedback.push({
      r: "Reparar y Restaurar",
      ejemplos: {
        estudiante: "Lleva tus zapatos a un zapatero en vez de comprar nuevos.",
        trabajador: "Repara tu laptop o celular en talleres locales.",
        amaCasa: "Aprende a coser para arreglar ropa o muebles tapizados.",
        emprendedor: "Ofrece servicio de reparación como valor agregado.",
        rural: "Repara herramientas agrícolas o equipos con apoyo de la comunidad."
      }
    });
  }

  if (recycleRecover < 4) {
    feedback.push({
      r: "Reciclar y Recuperar",
      ejemplos: {
        estudiante: "Separa plásticos en tu pensión y busca puntos de reciclaje en tu universidad.",
        trabajador: "Organiza una campaña de reciclaje en tu oficina.",
        amaCasa: "Haz compost con restos de comida; usa el abono en tus plantas.",
        emprendedor: "Asóciate con recicladores de base para gestionar residuos.",
        rural: "Haz compostaje comunitario o biogás con residuos orgánicos."
      }
    });
  }

  // Nivel general
  let nivel, color, mensajeGeneral;
  if (indice >= 80) {
    nivel = "Líder Circular 🌟";
    color = "#1b5e20";
    mensajeGeneral = "Eres un referente en economía circular. Inspira a otros.";
  } else if (indice >= 60) {
    nivel = "Avanzado ♻️";
    color = "#388e3c";
    mensajeGeneral = "Tienes buenas prácticas. Profundiza en las áreas de oportunidad.";
  } else if (indice >= 40) {
    nivel = "En desarrollo 🌱";
    color = "#689f38";
    mensajeGeneral = "Estás construyendo hábitos circulares. Sigue así.";
  } else {
    nivel = "Iniciando 🔍";
    color = "#9e9e9e";
    mensajeGeneral = "Todo gran cambio empieza con un primer paso. ¡Bienvenido!";
  }

  // Recomendaciones personalizadas
  const recomendacionesHTML = feedback.length > 0 ? `
    <h3>🔍 Áreas de oportunidad (personalizadas para ti)</h3>
    ${feedback.map(item => `
      <div class="recomendacion-item">
        <h4>${item.r}</h4>
        <p><strong>Para ti (${perfil}):</strong> ${item.ejemplos[perfil] || item.ejemplos.estudiante}</p>
      </div>
    `).join('')}
  ` : `
    <p>¡Felicidades! Aplicas consistentemente las 10R en tu vida diaria.</p>
  `;

  document.getElementById('resultado').innerHTML = `
    <div class="resultado-card">
      <h2>📊 Índice de Economía Circular</h2>
      <div style="font-size: 3rem; font-weight: bold; color: ${color}; margin: 15px 0;">
        ${indice}<small>/100</small>
      </div>
      <p><strong>Nivel:</strong> ${nivel}</p>
      <p>${mensajeGeneral}</p>
      
      <h3>📈 Desglose por principios (10R)</h3>
      <ul class="desglose">
        <li>Rechazar y Repensar: ${refuseRethink}/6</li>
        <li>Reducir: ${reduce}/6</li>
        <li>Reutilizar y Reutilizar con nuevo fin: ${reuseRepurpose}/6</li>
        <li>Reparar y Restaurar: ${repairRefurbish}/6</li>
        <li>Reciclar y Recuperar: ${recycleRecover}/6</li>
      </ul>

      ${recomendacionesHTML}

      <p><small>♻️ Basado en las 10R de la economía circular. En Perú, cada acción cuenta: desde el mercado local hasta el compostaje en el balcón.</small></p>
    </div>
  `;
});