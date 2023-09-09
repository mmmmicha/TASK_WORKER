import cron from 'node-cron';
import axios from 'axios';
import winston from 'winston';
import Tasks from '../model/tasks';

// 매 1분마다 worker 를 실행합니다.
let cronJob: cron.ScheduledTask | null = cron.schedule('*/1 * * * *', async () => {
	
    await tasksSender();

    console.info(`CronJob is running... This time is ${new Date().toLocaleString()}`);
	winston.info(`CronJob is running... This time is ${new Date().toLocaleString()}`);
});

export const postOn = async () => {
	console.info('CronJob start loading...');
	winston.info('CronJob start loading...');
	cronJob?.start();
	console.info('CronJob loaded');
	winston.info('CronJob loaded');
};

export const postOff = async () => {
	console.info('CronJob stop loading...');
	winston.info('CronJob stop loading...');
	cronJob?.stop();
	console.info('CronJob stopped');
	winston.info('CronJob stopped');
};

const tasksSender = async () => {
    const tomorrow = new Date().getTime() + 86400000;
    const tomorrowDate = new Date(tomorrow);
    const tasksList = await Tasks.find({ isSended: false, dueDate: { $lte: tomorrowDate} });
    console.log(tasksList);
    tasksList.forEach(async task => {
        let axiosParams = {
            url: task.toURL,
            method: 'POST',
        };
        axiosParams['data'] = {
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,  
        };
        axios(axiosParams).then(async res => {
            await task.updateOne({ isSended: true });
        }).catch(err => {
            console.error(`Error in task[${task.id}] : ${err.message}`);
        });
    });
}