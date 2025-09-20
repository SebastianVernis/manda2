module.exports = {
  apps: [
    {
      name: 'yega-backend',
      script: 'server.js',
      cwd: '/home/ec2-user/yega-app/backend',
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
      time: true,
      restart_delay: 4000,
      max_restarts: 10
    },
    {
      name: 'yega-caddy',
      script: 'caddy',
      args: 'run --config Caddyfile',
      cwd: '/home/ec2-user/yega-app',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/caddy-err.log',
      out_file: './logs/caddy-out.log',
      log_file: './logs/caddy-combined.log',
      time: true
    }
  ]
};