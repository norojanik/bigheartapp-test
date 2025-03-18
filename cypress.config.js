const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://qa.bigheartapp.org/", // Change this to your app's URL
    defaultCommandTimeout: 20000, // Set default timeout globally
    setupNodeEvents(on, config) {
      const file = config.env.configFile || "dev";
    },
  },
});
