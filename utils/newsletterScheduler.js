import sendEmail from './sendEmail.js';
import investor from '../models/investor.js';
import survey from '../models/survey.js';
import { CronJob } from 'cron';

const sendWeeklyNewsletter = async () => {
    // Get all the investors from the database
    const investors = await investor.find({}).select("email").lean();

    const startdate = new Date(Date.now());
    const enddate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const top10List = await survey.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: enddate,
                    $lte: startdate
                },
            },
        },
        { $sort: { rating: -1 } },
        { $limit: 10 },
        { $project: { _id: 1, startup: 1 } },
        { $lookup: { from: 'startups', localField: 'startup', foreignField: '_id', as: 'startup' } },
        { $unwind: '$startup' },
    ]);

    // Send the newsletter to each investor
    investors.forEach((investor) => {
        sendEmail({
            to: investor.email,
            subject: 'Weekly Newsletter Top 10 Promising Startups',
            html: `This week's top 10 promising startups are: ${top10List.map((startup) => startup.startup.website).join(', ')}`,
        });
    });
};

const scheduleWeeklyJob = new CronJob(
	'0 0 * * * *', // run every Sunday at 00:00
	() => {
		console.log('Started weekly newsletter job');
        sendWeeklyNewsletter();
	}, // onTick
	() => {
        console.log('Successfully sent the weekly newsletter');
    }, // onComplete
	'UTC+1' // Algeria timezone
);

export default scheduleWeeklyJob;