const mongoose = require('mongoose')

const PassengerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  idProof: String,
  passport: String,
  reference: String,
  servicesBooked: [String],
  status: [String],
  checkinTime: Date,
  reminderFlags: {
    type: [String],
    default: []
  }
})

module.exports = mongoose.models.Passenger || mongoose.model('Passenger', PassengerSchema)
