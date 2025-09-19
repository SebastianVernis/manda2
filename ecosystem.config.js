module.exports = {
  apps: [
    {
      name: 'yega-backend',
      script: 'server.js',
      cwd: '/home/sebastianvernis/nuevo-desplegue/yega-app/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGODB_URI: 'mongodb://localhost:27017/yega'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    },
    {
      name: 'yega-frontend',
      script: 'server.js',
      cwd: '/home/sebastianvernis/nuevo-desplegue/yega-app/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};