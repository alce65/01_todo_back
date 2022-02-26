import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export async function mongoConnect() {
    const user = process.env.DBUSER;
    const password = process.env.DBPASSWD;
    const dbName = process.env.DBNAME;
    const uri = `mongodb+srv://${user}:${password}@cluster0.dj9ya.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    // const mongoClient = new MongoClient(uri);
    // const mongoConnect = await mongoClient.connect();
    // const dbCoders = mongoConnect.db();
    const mongooseConnect = await mongoose.connect(uri);
    return mongooseConnect;
}

export async function installTasks(data, collection = 'tasks') {
    const { Task, connection } = await tasksConnect(collection);
    const deleted = await Task.deleteMany({});
    // await dbCoders.dropCollection(collection);
    const result = await Task.insertMany(data);
    connection.disconnect();
    return { result, deleted };
}

export async function tasksConnect(collection = 'tasks') {
    // const { mongoClient, dbCoders } = await mongoConnect();
    //const booksCollection = dbCoders.collection(collection);
    // return { mongoClient, booksCollection };
    const connection = await mongoConnect();
    const taskSchema = new mongoose.Schema({
        title: String,
        responsible: String,
        isCompleted: Boolean,
    });
    taskSchema.methods.algo = function () {};

    let Task;
    if (mongoose.default.models[collection]) {
        Task = mongoose.model(collection);
    } else {
        Task = mongoose.model(collection, taskSchema);
    }

    // const Task = mongoose.model(collection, taskSchema);
    return { Task, connection };
}
