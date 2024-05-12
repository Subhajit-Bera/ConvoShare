import mongoose from "mongoose";

//Database Connection
const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "Chattu" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
            throw err;
        });
};


export { connectDB}