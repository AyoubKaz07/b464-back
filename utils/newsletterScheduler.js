import schedule from 'node-schedule';
import sendEmail from './sendEmail.js';
import investor from '../models/investor.js';
import survey from '../models/survey.js';

const sendWeeklyNewsletter = () => {
    // Get all the investors from the database
    const investors = investor.find().select().lean();

    const top10List = survey.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: Date.now() - 7 * 24 * 60 * 60 * 1000,
                    $lte: Date.now(),
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
            body: `Here are the top 10 most promising startups of the week: ${top10List}`,
        });
    });
};

const scheduleWeeklyJob = () => {
  // Schedule the job to run every Sunday at midnight (0 0 * * 0)
  const job = schedule.scheduleJob('0 0 * * 0', sendWeeklyNewsletter);

  job.on('run', () => {
    console.log('Weekly newsletter job ran successfully');
  });
};

export default scheduleWeeklyJob;