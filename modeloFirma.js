const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Registrar la fuente Allura
registerFont(path.join(__dirname, 'Myallurafinal-Regular.ttf'), { family: 'Allura' });
registerFont(path.join(__dirname,'Taken by Vultures Demo.otf'), {family: 'Vultures'})
// Asegurarse de que la carpeta misGeneradas existe
const outputDir = path.join(__dirname, 'misGeneradas');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

// Funciones para generar curvas de Bézier con ruido
function quadraticBezier(p0, p1, p2, steps = 100, noiseIntensity = 0) {
  let points = [];
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    let y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    // Agregar irregularidad
    x += (Math.random() * 2 - 1) * noiseIntensity;
    y += (Math.random() * 2 - 1) * noiseIntensity;
    points.push({ x, y });
  }
  return points;
}

function cubicBezier(p0, p1, p2, p3, steps = 100, noiseIntensity = 0) {
  let points = [];
  for (let i = 0; i <= steps; i++) {
    let t = i / steps;
    let x = (1 - t) ** 3 * p0.x +
            3 * (1 - t) ** 2 * t * p1.x +
            3 * (1 - t) * t ** 2 * p2.x +
            t ** 3 * p3.x;
    let y = (1 - t) ** 3 * p0.y +
            3 * (1 - t) ** 2 * t * p1.y +
            3 * (1 - t) * t ** 2 * p2.y +
            t ** 3 * p3.y;
    // Agregar irregularidad
    x += (Math.random() * 2 - 1) * noiseIntensity;
    y += (Math.random() * 2 - 1) * noiseIntensity;
    points.push({ x, y });
  }
  return points;
}

function drawCurve(ctx, points, minWidth, maxWidth) {
  ctx.strokeStyle = "black";
  for (let i = 0; i < points.length - 1; i++) {
    const t = i / (points.length - 1);
    ctx.lineWidth = minWidth + t * (maxWidth - minWidth);
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(points[i + 1].x, points[i + 1].y);
    ctx.stroke();
  }
}

function drawTwoLetterImage(letter1, letter2,nombre, apellido, curveIntensity = 0.1) {
  const imageSize = 512;
  const fontSize = 110;
  const fontSizeLow = 60;
  
  const canvas = createCanvas(imageSize, imageSize);
  const ctx = canvas.getContext("2d");
  
  // Fondo blanco
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar iniciales
  ctx.font = `${fontSize}px Allura`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  const midY = imageSize / 2;
  const centerLeftX = imageSize / 4 + 20;
  const centerRightX = ((3 * imageSize) / 4) - 80;
  
  ctx.fillText(letter1, centerLeftX, midY);
  ctx.fillText(letter2, centerRightX, midY);
  
  // Diccionario unificado para el punto inicial y grosores, usado para la primera curva
  const curveConfig = {
    'A': { xOffset: 26, yOffset: 34, min: 1.9, max: 0.6 },
    'B': { xOffset: -29, yOffset: 7, min: 1.3, max: 0.6 },
    'C': { xOffset: -10, yOffset: 43, min: 2.0, max: 1.2 },
    'D': { xOffset: 166, yOffset: 54, min: 1.6, max: 1.2 },
    'E': { xOffset: -2, yOffset: 42.3, min: 2.0, max: 1.0 },
    'F': {xOffset: -10, yOffset: 34, min: 1.4, max: 0.8 },
    'G': { xOffset: 34, yOffset: 7, min: 1.2, max: 0.6 },
    'H': { xOffset: 29, yOffset: 35, min: 1.4, max: 0.8 },
    'I': { xOffset: 10, yOffset: 41, min: 1.6, max: 0.6 },
    'J': { xOffset: 25, yOffset: - 3, min: 1.2, max: 0.6 },
    'K': { xOffset: 27, yOffset: 40, min: 1.9, max: 1.2 },
    'L': { xOffset: -27, yOffset: -1, min: 1.6, max: 1.2 },
    'M': { xOffset: 35, yOffset: 30, min: 1.8, max: 1.2 },
    'N': { xOffset: - 40, yOffset: 43, min: 1.6, max: 0.6 },
    'O': { xOffset: 10, yOffset: -18, min: 1.8, max: 1.2 },
    'P': { xOffset: -22, yOffset: 42, min: 2.6, max: 1.2 },
    'Q': { xOffset: 20, yOffset: 41.2, min: 3.0, max: 1.4 },
    'R': { xOffset: 30, yOffset: 47, min: 4.0, max: 1.6 },
    'S': { xOffset: -6, yOffset: 11, min: 1.0, max: 0.4 },
    'T': { xOffset: -33, yOffset: 6.5, min: 1.4, max: 0.8 },
    'U': { xOffset: 7, yOffset: 40, min: 2.0, max: 1.2 },
    'V': { xOffset: -42, yOffset: -2, min: 1.0, max: 0.8 },
    'W': { xOffset: 38, yOffset: -21, min: 3.2, max: 0.6 },
    'X': { xOffset: 32, yOffset: 28.5, min: 2.8, max: 1.2 },
    'Y': { xOffset: 21, yOffset: 7, min: 1.4, max: 1.2 },
    'Z': { xOffset: 6, yOffset: 43, min: 2.4, max: 0.8 }
};

  // Configuración para la segunda curva, independiente
  const curve2Config = {
    'A': { xOffset: 27, yOffset: 35, min: 1.9, max: 0.6 },
    'B': { xOffset: - 28, yOffset: 7, min: 1.8, max: 0.8 },
    'C': { xOffset: - 0, yOffset: 7, min: 2.8, max: 0.8 },
    'D': { xOffset: 66, yOffset: 54, min: 4.0, max: 1.2 },
    'E': { xOffset: -3, yOffset: 42, min: 2.0, max: 1.0 },
    'F': { xOffset: 12, yOffset: 10, min: 1.6, max: 1.0 },
    'G': { xOffset: 33, yOffset: 7, min: 1.0, max: 0.6 },
    'H': { xOffset: 40, yOffset: 4, min: 1.4, max: 0.8 },
    'I': { xOffset: 32, yOffset: -18, min: 1.6, max: 0.6 },
    'J': { xOffset: 26, yOffset: -3, min: 1.2, max: 0.6 },
    'K': { xOffset: 28, yOffset: 40, min: 1.9, max: 1.2 },
    'L': { xOffset: 22, yOffset: 40.5, min: 5.0, max: 0.6 },
    'M': { xOffset: 40, yOffset: 29, min: 1.8, max: 0.8 },
    'N': { xOffset: 48, yOffset: -18, min: 1.8, max: 1.2 },
    'O': { xOffset: 7, yOffset: -18, min: 1.8, max: 0.8 },
    'P': { xOffset: -22, yOffset: 41, min: 2.6, max: 1.2 },
    'Q': { xOffset: 20, yOffset: 42, min: 2.6, max: 1.4 },
    'R': { xOffset: 33, yOffset: 46.8, min: 4.8, max: 0.8 },
    'S': { xOffset: -6, yOffset: 11.5, min: 1.0, max: 0.4 },
    'T': { xOffset: -22, yOffset: 40.5, min: 3.6, max: 0.8 },
    'U': { xOffset: 6, yOffset: 39.5, min: 2.4, max: 1.2 },
    'V': { xOffset: -41.5, yOffset: -1.5, min: 1.0, max: 0.8 },
    'W': { xOffset: 50, yOffset: -12, min: 1.8, max: 0.6 },
    'X': { xOffset: 36, yOffset: 29, min: 3.4, max: 1.2 },
    'Y': { xOffset: 20, yOffset: 6.5, min: 1.4, max: 1.2 },
    'Z': { xOffset: 15, yOffset: - 5.5, min: 2.8, max: 0.8 }
};
  
  const defaultCurveValues = { min: 1.5, max: 2.6 };
  
  // Punto inicial de la primera curva (usando la letra letter1)
  const params1 = curveConfig[letter1.toUpperCase()] || {};
  const start1 = {
    x: centerLeftX + (params1.xOffset || 0),
    y: midY + (params1.yOffset || 0)
  };
  const minLineWidth1 = params1.min || defaultCurveValues.min;
  const maxLineWidth1 = params1.max || defaultCurveValues.max;
  
  // Punto inicial de la segunda curva (usando la letra letter2)
  const params2 = curve2Config[letter2.toUpperCase()] || {};
  const start2 = {
    x: centerRightX + (params2.xOffset || 0),
    y: midY + (params2.yOffset || 0)
  };
  const minLineWidth2 = params2.min || defaultCurveValues.min;
  const maxLineWidth2 = params2.max || defaultCurveValues.max;
  
  // Definir manualmente cada valor para end1Overrides (para la primera curva)
  const end1Overrides = {
    'A': { x: centerRightX - 40, y: midY + 40 },
    'B': { x: centerRightX - 40, y: midY - 15 },
    'C': { x: centerRightX - 40, y: midY + 14 },
    'D': { x: centerRightX - 220, y: midY + 15 },
    'E': { x: centerRightX - 120, y: midY + 20 },
    'F': { x: centerRightX - 50, y: midY + 36 },
    'G': { x: centerRightX - 110, y: midY + 30 },
    'H': { x: centerRightX - 40, y: midY - 30 },
    'I': { x: centerRightX - 140, y: midY + 110 },
    'J': { x: centerRightX - 40, y: midY + 0 },
    'K': { x: centerRightX - 60, y: midY + 16 },
    'L': { x: centerRightX - 160, y: midY - 70 },
    'M': { x: centerRightX - 40, y: midY + 15 },
    'N': { x: centerRightX - 40, y: midY + 40 },
    'O': { x: centerRightX - 40, y: midY - 8 },
    'P': { x: centerRightX - 40, y: midY + 0 },
    'Q': { x: centerRightX - 40, y: midY + 0 },
    'R': { x: centerRightX - 40, y: midY + 20 },
    'S': { x: centerRightX - 40, y: midY + 28 },
    'T': { x: centerRightX - 40, y: midY + 0 },
    'U': { x: centerRightX - 100, y: midY + 20 },
    'V': { x: centerRightX - 40, y: midY + 0 },
    'W': { x: centerRightX - 40, y: midY + 0 },
    'X': { x: centerRightX - 40, y: midY + 28 },
    'Y': { x: centerRightX - 80, y: midY + 46 },
    'Z': { x: centerRightX - 130, y: midY + 50 }
  };
  
  // Utilizar el valor correspondiente para end1 según letter1
  const end1 = end1Overrides[letter1.toUpperCase()] || { x: centerRightX - 40, y: midY + 40 };

  // Para la segunda curva, definimos end2 de forma independiente usando start2.
  // Se crea un diccionario con offsets fijos (puedes ajustar estos valores según lo que necesites)
  const end2Overrides = {
    'A': { x: start2.x - 150, y: start2.y + 50 },
    'B': { x: start2.x + 60, y: start2.y + 76 },
    'C': { x: start2.x -100, y: start2.y - 5 },
    'D': { x: start2.x + 100, y: start2.y - 24 },
    'E': { x: start2.x + 120, y: start2.y + 0 },
    'F': { x: start2.x + 100, y: start2.y + 0 },
    'I': { x: start2.x + 50, y: start2.y + 40 },
    'K': { x: start2.x + 50, y: start2.y + 10 },
    'L': { x: start2.x + 0, y: start2.y - 14 },
    'O': { x: start2.x + 40, y: start2.y + 6 },
    'P': { x: start2.x + 100, y: start2.y + 20 },
    'Q': { x: start2.x + 100, y: start2.y - 0 },
    'R': { x: start2.x + 100, y: start2.y - 0 },
    'S': { x: start2.x + 130, y: start2.y + 30 },
    'T': { x: start2.x + 130, y: start2.y + 31 },
    'U': { x: start2.x + 130, y: start2.y + 0 },
    'V': { x: start2.x + 150, y: start2.y + 15 },
    'W': { x: start2.x + 100, y: start2.y + 25 },
    'X': { x: start2.x + 120, y: start2.y + 15 },
    'Y': { x: start2.x + 120, y: start2.y - 0 },
    'Z': { x: start2.x + 120, y: start2.y - 10 },
    // Para las demás letras se puede agregar según necesidad
  };
  
  // Utilizar el valor correspondiente para end2 según letter2; si no existe, se usa un valor por defecto
  const end2 = end2Overrides[letter2.toUpperCase()] || { 
    x: start2.x + 50, 
    y: start2.y + 50 
  };
  
  // Diccionario para el control personalizado de la primera curva
  const control1Overrides = {
    'A': {
      x: (start1.x + end1.x) / 2,
      y: (start1.y + end1.y) / 2 + (Math.random() - 0.5) * 10 * curveIntensity
    },
    'B': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 20 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'C': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 10 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'D': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 5 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'E': { 
      x: (start1.x + end1.x) / 2 + 50 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'F': { 
      x: (start1.x + end1.x) / 2 + 150 +(Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 34 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'G': { 
      x: (start1.x + end1.x) / 2 - 6 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 80 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'H': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 8 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'I': { 
      x: (start1.x + end1.x) / 2 + 60 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 50 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'J': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 5 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'K': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 10 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'L': { 
      x: (start1.x + end1.x) / 2 + 180 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 15 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'M': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 5 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'N': { 
      x: (start1.x + end1.x) / 2 - 280 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 10 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'O': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 8 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'P': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 5 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'Q': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 40 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'R': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 14 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'S': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 10 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'T': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 30 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'U': { 
      x: (start1.x + end1.x) / 2 + 150 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 30 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'X': { 
      x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'Y': { 
      x: (start1.x + end1.x) / 2 + 106 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 40 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'Z': { 
      x: (start1.x + end1.x) / 2 + 200 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 - 20 + (Math.random() - 0.5) * 3 * curveIntensity
    }
  };
  const control1 = control1Overrides[letter1.toUpperCase()] || {
    x: (start1.x + end1.x) / 2 + (Math.random() - 0.5) * 2 * curveIntensity,
    y: start1.y + 50 + (Math.random() - 0.5) * 2 * curveIntensity
  };
  
  const bezier1 = quadraticBezier(start1, control1, end1, 100, 2 * curveIntensity);
  drawCurve(ctx, bezier1, minLineWidth1, maxLineWidth1);
  
  // Diccionario para el control personalizado de la segunda curva (independiente)
  const control2Overrides = {
    'A': {
      x: start2.x + 110 + (Math.random() - 0.5) * 40 * curveIntensity,
      y: midY - 80 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'B': {
      x: start2.x + (Math.random() - 0.5) * 40 * curveIntensity,
      y: midY - 46 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'C': {
      x: start2.x - 200 + (Math.random() - 0.5) * 40 * curveIntensity,
      y: midY + 10 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'D': { 
      x: start2.x - 80 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: midY - 0 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'E': { 
        x: start2.x + 190 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 100 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'F': { 
        x: start2.x + 180 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 0 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'G': { 
        x: start2.x + 180 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 0 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'H': { 
        x: start2.x + 300 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 70 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'I': { 
        x: start2.x + 150 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY + 30 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'J': { 
        x: start2.x + 300 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 30 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'K': { 
        x: start2.x + 300 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 30 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'L': { 
        x: start2.x + 150 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY + 80 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'M': { 
        x: start2.x + 300 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 30 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'N': { 
        x: start2.x + 300 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 30 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'O': { 
        x: start2.x + 200 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY - 40 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'P': { 
        x: start2.x + 400 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY + 12 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'R': { 
        x: start2.x + 200 + (Math.random() - 0.5) * 40 * curveIntensity,
        y: midY + 80 + (Math.random() - 0.5) * 40 * curveIntensity
    },
    'S': { 
      x: (start1.x + end1.x) / 2 + 220 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 20 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'T': { 
      x: (start1.x + end1.x) / 2 + 500 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 30 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'V': { 
      x: (start1.x + end1.x) / 2 + 500 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 0 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'W': { 
      x: (start1.x + end1.x) / 2 + 400 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 0 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'Y': { 
      x: (start1.x + end1.x) / 2 + 400 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 0 + (Math.random() - 0.5) * 3 * curveIntensity
    },
    'Z': { 
      x: (start1.x + end1.x) / 2 + 500 + (Math.random() - 0.5) * 5 * curveIntensity,
      y: (start1.y + end1.y) / 2 + 0 + (Math.random() - 0.5) * 3 * curveIntensity
    }
    // Se pueden agregar más letras con controles específicos para la segunda curva
  };
  const control2_1 = control2Overrides[letter2.toUpperCase()] || {
    x: start2.x + 19 + (Math.random() - 0.5) * 40 * curveIntensity,
    y: midY + 26 + (Math.random() - 0.5) * 40 * curveIntensity
  };
  // Se mantiene el segundo punto de control de la segunda curva sin diccionario
  const control2_2 = {
    x: start2.x + (Math.random() - 0.5) * 40 * curveIntensity,
    y: midY - 80 + (Math.random() - 0.5) * 40 * curveIntensity
  };

  let bezier2;
  if (["A","C", "B", "E", "F", "G", "H", "I", "J", "M", "N", "P", "R", "T","V", "W", "Y", "Z"].includes(letter2.toUpperCase())) {
    // Si letter2 es A o B se usa la curva cúbica
    bezier2 = cubicBezier(start2, control2_1, control2_2, end2, 100, 2 * curveIntensity);
  } else {
    // Para las demás letras se usa la curva cuadrática
    bezier2 = quadraticBezier(start2, control2_1, end2, 100, 2 * curveIntensity);
  }
  
  drawCurve(ctx, bezier2, minLineWidth2, maxLineWidth2);

  const nomApePos = [
    { x: 58, y: 20 },  // A
    { x: 62, y: 20 },  // B
    { x: 40, y: 20 },  // C
    { x: 63, y: 20 },  // D
    { x: 56, y: 20 },  // E
    { x: 44, y: 20 },  // F
    { x: 64, y: 20 },  // G
    { x: 68, y: 20 },  // H
    { x: 38, y: 20 },  // I
    { x: 44, y: 20 },  // J
    { x: 56, y: 20 },  // K
    { x: 44, y: 14 },  // L
    { x: 74, y: 10 },  // M
    { x: 66, y: 20 },  // N
    { x: 56, y: 20 },  // O
    { x: 56, y: 18 },  // P
    { x: 56, y: 20 },  // Q
    { x: 50, y: 20 },  // R
    { x: 66, y: 7 },  // S
    { x: 22, y: 25 },  // T
    { x: 50, y: 20 },  // U
    { x: 34, y: 25 },  // V
    { x: 72, y: 20 },  // W
    { x: 66, y: 12 },  // X
    { x: 40, y: 20 },  // Y
    { x: 46, y: 20 }   // Z
  ];
  
  nombre = removeAccents(nombre);
  apellido = removeAccents(apellido);
  console.log(nombre);
  console.log(apellido);

  let e1 = alphabet.indexOf(letter1);
  let e2 = alphabet.indexOf(letter2);

  // Obtener las posiciones x e y de nomApePos basadas en letter1 y letter2
  const posNombre = nomApePos[e1];
  const posApellido = nomApePos[e2];

  // Aumentar +10 a la posición x si el nombre tiene más de 5 letras
  if (nombre.length > 5) {
      posNombre.x += 10;
    }
  
  // Aumentar +10 a la posición x si el apellido tiene más de 5 letras
  if (apellido.length > 5) {
    posApellido.x += 10;
  }

  ctx.font = `${fontSizeLow}px Vultures`;
  ctx.fillText(nombre, centerLeftX + posNombre.x, midY + posNombre.y);
  ctx.fillText(apellido, centerRightX + posApellido.x, midY + posApellido.y);

   // En lugar de guardar, retornamos el buffer
   const buffer = canvas.toBuffer('image/png');
   return buffer;
}

function generarImagen(nombre, apellido) {

        const letter1 = nombre[0];
        // Se puede cambiar la selección de letter2 según convenga; en este ejemplo se usa la letra en la posición 3
        const letter2 = apellido[0];
        // Eliminar el primer elemento de nombre y apellido
        nombre = nombre.slice(1);
        apellido = apellido.slice(1);
        const curveIntensity = 0.1;
        const buffer = drawTwoLetterImage(letter1, letter2, nombre, apellido, curveIntensity);
        return buffer;
}

module.exports = { generarImagen };

