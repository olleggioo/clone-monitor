/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  env: {
    AUTH_URL: 'https://prommonitor.com/api/v1/',
    LOG_URL: 'https://log.prom-monitor.ru/',
    API_URL: 'https://prommonitor.com/api/v1/',
    LIST_LOG_URL: 'https://prommonitor.com/api/v1/',
    ROLE_CLIENT_ID: "b3c5ce0e-884d-11ee-932b-300505de684f",
    ROLE_ROOT_ID: "b3c5cc10-884d-11ee-932b-300505de684f",
    ROLE_MANAGER_ID: "b9507b39-884d-11ee-932b-300505de684f",
    ROLE_BOX_ID: "91e4d482-7951-11ef-90a7-300505de684f"
  }
}

module.exports = nextConfig
