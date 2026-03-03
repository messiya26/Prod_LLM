module.exports = {
  apps: [{
    name: "llm-api",
    script: "dist/main.js",
    cwd: "/opt/llm-api/apps/api",
    instances: 2,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3002,
    },
    max_memory_restart: "500M",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "/opt/llm-api/logs/api-error.log",
    out_file: "/opt/llm-api/logs/api-out.log",
    merge_logs: true,
  }],
};
