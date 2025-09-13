#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const BLACKBOX_API_KEY = process.env.BLACKBOX_API_KEY || 'TU_API_KEY_AQUI';

const FRONTEND_ROOT = process.cwd();
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const FOLDERS_TO_READ = ['src/components', 'src/pages', 'src/styles', 'src/services'];

// Lee archivos recursivamente y concatena contenido
function readFilesRecursively(dir) {
  let filesContent = '';

  if (!fs.existsSync(dir)) return '';

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      filesContent += readFilesRecursively(fullPath);
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      filesContent += `\nArchivo: ${path.relative(FRONTEND_ROOT, fullPath)}\n`;
      filesContent += '```jsx\n' + content + '\n```\n';
    }
  }

  return filesContent;
}

// Llama a la API Blackbox con contexto y tarea
async function generateCodeWithContext(filesContent, taskDescription) {
  const systemMessage = {
    role: 'system',
    content: 'Eres un asistente experto en frontend React moderno, con enfoque en diseño responsive y buenas prácticas.'
  };

  const userMessage = {
    role: 'user',
    content: `
Estos son los archivos actuales del frontend:

${filesContent}

Tarea: ${taskDescription}
Por favor, genera el código solicitado respetando la estructura y estilo del proyecto.
`
  };

  try {
    const response = await axios.post(
      'https://api.blackbox.ai/chat/completions',
      {
        model: 'blackboxai/openai/gpt-4',
        messages: [systemMessage, userMessage],
        max_tokens: 2000,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${BLACKBOX_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generando código:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Guarda código generado en archivo, crea carpetas si no existen
function saveGeneratedCode(relativePath, code) {
  const fullPath = path.join(FRONTEND_ROOT, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, code, 'utf8');
  console.log(`Archivo generado/actualizado en: ${fullPath}`);
}

async function main() {
  // Lista de tareas frontend a ejecutar secuencialmente
  const tasks = [
    {
      description: 'Genera el componente React para la pantalla Cliente que muestre un listado de tiendas y productos con diseño responsive, usando la paleta de colores definida (fondo negro, texto blanco, acentos plata y oro metálico). Incluye mockup de datos estáticos.',
      outputPath: 'src/pages/Cliente.js',
    },
    {
      description: 'Genera el componente React para la pantalla Tienda que permita gestionar inventario con inputs para stock editable y botón guardar con validación simple.',
      outputPath: 'src/pages/Tienda.js',
    },
    {
      description: 'Genera el componente React para la pantalla Repartidor que muestre lista de pedidos con estados y envíe ubicación GPS cada 10 segundos, mostrando mapa con ubicación actual.',
      outputPath: 'src/pages/Repartidor.js',
    },
    {
      description: 'Genera el componente React para la pantalla Administrador que liste usuarios pendientes con paginación, búsqueda y botones aprobar/rechazar.',
      outputPath: 'src/pages/Administrador.js',
    },
    {
      description: `Genera un módulo o servicio en React para gestionar la conexión con el backend. 
Incluye funciones para:
- Autenticación (login, logout, guardar y enviar token JWT en headers).
- Llamadas genéricas GET, POST, PUT, DELETE con manejo básico de errores.
- Configuración base de la URL del backend (usando variable de entorno).
- Exporta funciones para usar en componentes frontend.`,
      outputPath: 'src/services/apiClient.js',
    },
  ];

  for (const task of tasks) {
    console.log(`\n=== Procesando tarea frontend: ${task.description.substring(0, 60)}... ===`);

    // Leer estructura frontend actualizada antes de cada tarea
    let filesContent = '';
    for (const folder of FOLDERS_TO_READ) {
      filesContent += readFilesRecursively(path.join(FRONTEND_ROOT, folder));
    }

    if (!filesContent) {
      console.warn('No se encontraron archivos en las carpetas clave del frontend.');
      filesContent = `
El proyecto frontend está vacío. Por favor, genera el código siguiendo estas pautas:
- Usa React moderno con hooks.
- Paleta de colores: fondo negro, texto blanco, acentos plata y oro metálico.
- Diseño responsive.
- Estructura de carpetas estándar (src/components, src/pages, src/styles, src/services).
`;
    }

    // Generar código con contexto
    const generatedCode = await generateCodeWithContext(filesContent, task.description);

    // Guardar código generado
    saveGeneratedCode(task.outputPath, generatedCode);
  }

  console.log('\n=== Todas las tareas frontend completadas ===');
}

main();
