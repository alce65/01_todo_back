import { installTasks } from './db.js';
import data from './task.data.js';

const collection = 'tasks';

installTasks(data.tasks, collection).then(({ result }) => console.log(result));
