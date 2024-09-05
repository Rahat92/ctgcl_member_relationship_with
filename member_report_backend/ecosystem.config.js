module.exports = {
    apps: [
      {
        name: "my-app",
        script: "./index.js",
        env: {
          // PORT: 3000,
          MY_ENV_VAR: "default_value",
          IS_EMAIL_MODULE: true,
          NAME: "Kamrul",
        },
        env_production: {
          // PORT: 8000,
          MY_ENV_VAR: "production_value",
          IS_EMAIL_MODULE: true,
          NAME: "Kamrul",
        },
      },
    ],
  };
  