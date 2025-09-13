const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./utils/sendEmail.js');

const logFilePath = path.join(__dirname, '.pm2', 'logs', 'yega-api-error.log');
const lastPosFilePath = path.join(__dirname, 'log_checker_last_pos.txt');

const checkLogs = async () => {
  try {
    let lastPos = 0;
    if (fs.existsSync(lastPosFilePath)) {
      lastPos = parseInt(fs.readFileSync(lastPosFilePath, 'utf8'), 10);
    }

    const stats = fs.statSync(logFilePath);
    const fileSize = stats.size;

    if (fileSize > lastPos) {
      const stream = fs.createReadStream(logFilePath, { start: lastPos, end: fileSize });
      let newData = '';
      stream.on('data', (chunk) => {
        newData += chunk.toString();
      });

      stream.on('end', async () => {
        if (newData) {
          const recipient = process.env.EMAIL_NOTIFICATIONS_RECIPIENT;
          if (recipient) {
            await sendEmail(
              recipient,
              'Alerta de Error en YEGA API',
              `Se han detectado nuevos errores en el log de la API de YEGA:\n\n${newData}`
            );
          }
        }
        fs.writeFileSync(lastPosFilePath, fileSize.toString(), 'utf8');
      });
    }
  } catch (error) {
    console.error('Error al verificar los logs:', error);
  }
};

checkLogs();
