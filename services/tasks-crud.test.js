/* eslint-disable no-unused-vars */
import { installTasks, tasksConnect } from './db.js';
import data from './task.data.js';
import * as tasksSrv from './tasks-crud.js';

describe('given a connection with a MongoDB', () => {
    describe('when a collection is defined and populated', () => {
        let connection;
        let Task;
        let initialCount;
        let first_id;
        const collection = 'testingTasks';
        beforeAll(async () => {
            const { result: mockCollection } = await installTasks(
                data.tasks,
                collection
            );
            initialCount = mockCollection.length;
            first_id = mockCollection[0].id;
            ({ connection, Task } = await tasksConnect(collection));
        });
        afterAll(() => {
            connection.disconnect();
        });
        test('should connect to the collection', async () => {
            expect(Task).toBeTruthy();
            expect(Task.modelName).toBe(collection);
        });
        test('should get all the items', async () => {
            const result = await tasksSrv.getAllTasks(Task);
            expect(result.length).toBe(initialCount);
        });

        test('should get one item by id', async () => {
            const result = await tasksSrv.getTask(first_id, Task);
            expect(result).toHaveProperty('_id');
            expect(result.id).toBe(first_id);
            expect(result.title).toBe('Diseñar la Home');
        });

        test('should add a new item', async () => {
            const newTask = {
                title: 'Desplegar la Home',
                responsible: 'Julia',
                isCompleted: false,
            };
            const result = await tasksSrv.insertTask(newTask, Task);
            expect(result).toHaveProperty('_id');
            expect(result.title).toBe('Desplegar la Home');
        });

        test('should update a item', async () => {
            const partialTask = {
                isCompleted: true,
            };
            const result = await tasksSrv.updateTask(
                first_id,
                partialTask,
                Task
            );
            expect(result.title).toBe('Diseñar la Home');
            expect(result.isCompleted).toBe(true);
        });
        test('should delete a item"', async () => {
            const result = await tasksSrv.deleteTask(first_id, Task);
            expect(result.id).toBe(first_id);
            const allTasks = await tasksSrv.getAllTasks(Task);
            // after insert one and delete one
            expect(allTasks.length).toBe(initialCount);
        });
    });
});
