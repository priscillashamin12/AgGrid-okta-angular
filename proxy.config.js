



const PROXY_CONFIG = {
  "/api/*": {
  //  target: "http://localhost:2017",
  target: "http://10.251.117.249:2017",
  // target: "http://10.251.117.242:2017",

    secure: false,

    logLevel: "info",

    changeOrigin: true
  }
};

module.exports = PROXY_CONFIG;
