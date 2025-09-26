import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error(
    "Por favor, define la variable de entorno MONGO_URI en tu archivo .env"
  );
}

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error("Error al conectar a la base de datos MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Base de datos MongoDB desconectada exitosamente.");
  } catch (error) {
    console.error("Error al desconectar de la base de datos MongoDB:", error);
    process.exit(1);
  }
};

export const getConnection = () => {
  return mongoose.connection;
};
