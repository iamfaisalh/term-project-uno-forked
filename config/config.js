require('dotenv').config();
//npx sequelize db:seed:all
module.exports = {
  "development": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
  },
  "test": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false,
      },
    }
  }
}
