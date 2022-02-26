import * as dotenv from 'dotenv';
dotenv.config();
import { mongoConnect, tasksConnect, installTasks } from './db.js';

describe('given a connection with MongoDB', () => {
    const collection = 'testingTasks';
    beforeAll(() => {});

    test('then should be possible connect to our DB ', async () => {
        const connect = await mongoConnect();
        expect(connect).toBeTruthy();
        expect(connect.connections[0].name).toBe(process.env.DBNAME);
        connect.disconnect();
    });

    test('then should exist our Model ', async () => {
        const { Task, connection } = await tasksConnect(collection);
        expect(connection.connections[0].name).toBe(process.env.DBNAME);
        expect(Task).toBeTruthy();
        expect(Task.modelName).toBe(collection);
        connection.disconnect();
    });

    test('then it should be created and populated', async () => {
        // const { Task, connection } = await tasksConnect(collection);
        const { result } = await installTasks([], collection);
        expect(result).toBeTruthy();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });
});
