/* eslint-disable no-unused-vars */
import * as crud from '../services/tasks-crud.js';
import { tasksConnect } from '../services/db.js';
import { verifyToken } from '../services/auth.js';

export let Task;
tasksConnect().then((resp) => {
    // console.log(resp);
    Task = resp.Task;
});

/* export const { Task } = await tasksConnect(); */

/* export const getAllTasks = (req, res, next) => {
    crud.getAllTasks(Task)
        .then((resp) => {
            res.json(resp);
        })
        .catch((err) => next(err));
}; */

export const getAllTasks = async (req, res, next) => {
    try {
        const resp = await crud.getAllTasks(Task);
        res.json(resp);
    } catch (err) {
        next(err);
    }
};

export const getTask = (req, res, next) => {
    crud.getTask(req.params.id, Task)
        .then((resp) => {
            res.json(resp);
        })
        .catch((err) => next(err));
};

export const insertTask = (req, res) => {
    crud.insertTask(req.body, Task).then((resp) => {
        res.json(resp);
    });
};

export const updateTask = (req, res) => {
    crud.updateTask(req.params.id, req.body, Task).then((resp) => {
        res.json(resp);
    });
};
export const deleteTask = (req, res) => {
    crud.deleteTask(req.params.id, Task).then((resp) => {
        if (resp) {
            res.status(202);
            res.json(resp);
        } else {
            res.status(204);
            res.json({ message: 'Tarea no existente' });
        }
    });
};

export const protectRoute = (req, res, next) => {
    const authorization = req.get('authorization');
    let token;
    let decodedToken;
    try {
        if (authorization && authorization.toLowerCase().startsWith('bearer')) {
            token = authorization.substring(7);
            decodedToken = verifyToken(token);
            if (typeof decodedToken === 'string') {
                throw new Error();
            }
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(401).json({
            error: 'token missing or invalid',
        });
    }
};
