const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
  email: String,
  phone: String,
  reference: String,
  flightNo: String,
  departure: String,
  arrival: String,
  depTime: Date,
  boardTime: Date,
  seat: String,
  zone: String,
  sequence: String,
})

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)
