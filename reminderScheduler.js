const mongoose = require('mongoose')
const cron = require('node-cron')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')

dotenv.config()

const Ticket = require('./src/models/Ticket.js')
const Passenger = require('./src/models/Passenger.js')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🟢 Connected to MongoDB')
}).catch(console.error)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('🔔 Checking for reminders...')
  const now = new Date()

  const tickets = await Ticket.find({ reference: { $exists: true } })

  for (const ticket of tickets) {
    const depTime = new Date(ticket.depTime)
    const hoursLeft = (depTime - now) / (1000 * 60 * 60)

    if (Math.abs(hoursLeft - 24) < 0.2 || Math.abs(hoursLeft - 5) < 0.2) {
      const passenger = await Passenger.findOne({ reference: ticket.reference })
      if (!passenger) continue

      const subject = `🛫 Reminder: Your flight is in ${Math.round(hoursLeft)} hours`

      const depDate = new Date(ticket.depTime).toLocaleString('en-IN')
      const boardDate = new Date(ticket.boardTime).toLocaleString('en-IN')
      
      // Dummy location for Google Maps example
      const airportLocation = 'Rajiv Gandhi International Airport'
      const mapsURL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(airportLocation)}`
      
      const services = [
        [`📍 Distance & Duration`, mapsURL],
        [`🚗 Book Ride (Uber/Ola)`, 'https://example.com/book-ride'],
        [`🪑 Premium Lounge Booking`, 'https://example.com/lounge'],
        [`🕶️ XR Airport Experience`, 'https://example.com/xr'],
        [`🥗 Local Veg Meal`, 'https://example.com/veg-meal'],
        [`🍗 Local Non-Veg Meal`, 'https://example.com/nonveg-meal'],
      ]
      
      const html = `
        <h2>Hi ${passenger.name},</h2>
        <p>This is a reminder that your flight <b>${ticket.flightNo}</b> from <b>${ticket.departure}</b> to <b>${ticket.arrival}</b> is coming up in <b>${Math.round(hoursLeft)} hours</b>.</p>
        <ul>
          <li><b>Boarding:</b> ${boardDate}</li>
          <li><b>Departure:</b> ${depDate}</li>
          <li><b>Gate:</b> Gate A1 (simulated)</li>
        </ul>
        <hr/>
        <h3>🧾 Recommended Services:</h3>
        <ul>
          ${services.map(([label, link]) => `<li><a href="${link}">${label}</a></li>`).join('')}
        </ul>
        <br/>
        <p>Have a safe journey!<br/>— FlyMate ✈️</p>
      `
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: passenger.email,
        subject,
        html,
      })
      

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: passenger.email,
        subject,
        text
      })

      console.log(`✅ Reminder sent to ${passenger.email} (${Math.round(hoursLeft)}h left)`)
    }
  }
})
