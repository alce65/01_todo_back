import { Error, mongo } from 'mongoose';
import { installTasks, tasksConnect } from './db.js';
import data from './task.data.js';
import * as tasksSrv from './tasks-crud.js';

describe('given a connection with a MongoDB', () => {
    describe('when a collection is defined and populated', () => {
        let connection;
        let Task;
        let initialCount;
        let first_id;
        let invalid_id;
        const collection = 'testingTasks';
        beforeAll(async () => {
            const { result: mockCollection } = await installTasks(
                data.tasks,
                collection
            );
            initialCount = mockCollection.length;
            first_id = mockCollection[0].id;
            invalid_id = '621a1603366d76fe79fbb93a';
            ({ connection, Task } = await tasksConnect(collection));
        });
        afterAll(() => {
            connection.disconnect();
        });
        test('should connect to the collection', async () => {
            expect(Task).toBeTruthy();
            expect(Task.modelName).toBe(collection);
        });

        describe('and try to get all the items', () => {
            test('should get all of them', async () => {
                const result = await tasksSrv.getAllTasks(Task);
                expect(result.length).toBe(initialCount);
            });
        });

        describe('and try to get one item by id', () => {
            test('should find and get the item', async () => {
                const result = await tasksSrv.getTask(first_id, Task);
                expect(result).toHaveProperty('_id');
                expect(result.id).toBe(first_id);
                expect(result.title).toBe('Diseñar la Home');
            });
            test('should not find and get the item with invalid id', async () => {
                const result = await tasksSrv.getTask(invalid_id, Task);
                expect(result).toBe(null);
            });
            test('should not find and get the item with malformed id', async () => {
                await expect(
                    tasksSrv.getTask('0000', Task)
                ).rejects.toThrowError(Error.CastError);
            });
        });

        describe('and try to add a new item ', () => {
            test('should add a valid item', async () => {
                const newTask = {
                    title: 'Desplegar la Home',
                    responsible: 'Julia',
                    isCompleted: false,
                };
                const result = await tasksSrv.insertTask(newTask, Task);
                expect(result).toHaveProperty('_id');
                expect(result.title).toBe('Desplegar la Home');
            });
            test('should not add a invalid item (required missing)', async () => {
                const newTask = {
                    responsible: 'Julia',
                    isCompleted: false,
                };
                await expect(
                    tasksSrv.insertTask(newTask, Task)
                ).rejects.toThrowError(Error.ValidationError);
            });
            test('should not add a invalid item (not unity when required )', async () => {
                const newTask = {
                    title: 'Desplegar la Home',
                    responsible: 'Julia',
                    isCompleted: false,
                };
                await expect(
                    tasksSrv.insertTask(newTask, Task)
                ).rejects.toThrowError(mongo.MongoServerError);
            });
        });

        describe('and try to update a item', () => {
            test('should update the item if id is valid', async () => {
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
            test('should not update the item if id is not valid', async () => {
                const result = await tasksSrv.updateTask(invalid_id, {}, Task);
                expect(result).toBe(null);
            });
        });
        describe('and try to delete a item', () => {
            test('should delete the item if id is valid', async () => {
                const result = await tasksSrv.deleteTask(first_id, Task);
                expect(result.id).toBe(first_id);
                const allTasks = await tasksSrv.getAllTasks(Task);
                // after insert one and delete one
                expect(allTasks.length).toBe(initialCount);
            });
            test('should not delete the item if id is not valid', async () => {
                const result = await tasksSrv.deleteTask(invalid_id, Task);
                expect(result).toBe(null);
            });
        });
    });
});
