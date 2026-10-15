// Permite publicar a versão web num subcaminho (ex.: GitHub Pages em /BodyBalanceAI).
module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, baseUrl: process.env.EXPO_BASE_URL || undefined },
});
