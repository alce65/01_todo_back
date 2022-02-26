// import mongoose from 'mongoose';
import * as controller from './tasks.controller.js';
import { tasksConnect } from '../services/db.js';

jest.mock('../services/db.js');

describe('Given the tasks controller', () => {
    let req;
    let res;
    let next;
    const Task = controller.Task;
    beforeEach(() => {
        tasksConnect.mockResolvedValue({});
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    describe('When getAllTasks is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                Task.find.mockReturnValue({});
            });
            test('Then call send', async () => {
                await controller.getAllTasks(req, res, next);
                expect(res.send).toHaveBeenCalled();
            });
        });
        /*  describe('And it does not work (promise is rejected)', () => {
      beforeEach(() => {
        Task.find.mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error()),
        });
      });
      test('Then call next', async () => {
        await controller.getAllTasks(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    }); */
    });
});
