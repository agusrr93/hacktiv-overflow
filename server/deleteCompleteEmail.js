const CronJob = require('cron').CronJob
const kue = require('kue')
  , queue = kue.createQueue()

new CronJob('0 0 * * * *', function() {
  queue.complete( function( err, jobs ) { 
    jobs.forEach(id => {
      kue.Job.get(id, (err, job) => {
        if (err) {
          console.log(err)
        } else {
          job.remove()
        }
      })
    })
  });
}, null, true, 'Asia/Jakarta');