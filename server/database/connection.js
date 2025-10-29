const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const con = await mongoose.connect("mongodb+srv://developerroshan09_db_user:keqgun-wuwpyq-4Qedry@cluster0.rvpxb6b.mongodb.net/?appName=Cluster0", {//'mongodb://127.0.0.1:27017/users', { //process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;