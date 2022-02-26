// import { tasksConnect} from './db.js';

export async function getAllTasks(Task) {
    /* const { booksCollection, mongoClient } = await booksConnect();
    const cursor = booksCollection.find();
    const result = await cursor.toArray();
    mongoClient.close(); */
    return await Task.find({});
}

export async function getTask(id, Task) {
    /*  const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOne({ _id: dbId });
    mongoClient.close(); */
    return await Task.findById(id);
}

export async function insertTask(task, Task) {
    /* const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.insertOne(book);
    mongoClient.close(); */
    const newTask = new Task(task);
    newTask.algo();
    return await newTask.save();
}

export async function updateTask(id, partialTask, Task) {
    /* const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOneAndUpdate(
        { _id: dbId },
        {
            $set: { ...partialBook },
        }
    );
    mongoClient.close(); */
    return await Task.findByIdAndUpdate(id, partialTask, { new: true });
}

export async function deleteTask(id, Task) {
    /* const dbId = ObjectId(id);
    const { booksCollection, mongoClient } = await booksConnect();
    const result = await booksCollection.findOneAndDelete({ _id: dbId });
    mongoClient.close(); */
    return await Task.findByIdAndDelete(id);
}
