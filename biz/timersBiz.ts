import cron from 'node-cron';
import Timerinfo from '../model/timerinfo';
import axios from 'axios';
import winston from 'winston';

// 매 3초마다 worker 를 실행합니다.
let cronJob: cron.ScheduledTask | null = cron.schedule('* * * * * *', async () => {
	// 여기에 worker 를 넣어주세요
	const timerList = await Timerinfo.find();
	let workingTimerListString = '';
    timerList.forEach(timer => {
        let axiosParams = {
            url: timer.url,
            method: timer.method,
        };
        if (timer.query) axiosParams['params'] = timer.query;
        if (timer.data) axiosParams['data'] = timer.data;
        if (timer.headers) axiosParams['headers'] = timer.headers;
        axios(axiosParams).catch(err => {
            console.error(`Error in ${timer.workerName} : ${err.message}`);
        });
        workingTimerListString += `${timer.workerName}, `;
    });
    console.info(`CronJob is running... This time is ${new Date().toLocaleString()}, job list : ${workingTimerListString}`);
	winston.info(`CronJob is running... This time is ${new Date().toLocaleString()}, job list : ${workingTimerListString}`);
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