const kue = require('kue')
  , queue = kue.createQueue()
  , nodemailer = require('nodemailer')
const CronJob = require('cron').CronJob

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
          user: 'hacktivoverflow2010@gmail.com',
          pass: 'sedani89'
  }
})

new CronJob('5 * * * * *', function() {
  let job = queue.process('email', (job, done) => {
    sendMail(job.data, done)
  })
}, null, true, 'Asia/Jakarta');

function sendMail(emailOptions, done) {
  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err.message)
    } else {
      console.log(info)
      done()
    }
  })
}