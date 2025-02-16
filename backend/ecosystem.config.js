module.exports = {
  apps: [{
    name: 'razvivashka-backend',
    script: 'src/server.js',
    watch: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    max_memory_restart: '200M'
  }]
}; 