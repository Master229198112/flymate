'use client'
import { useState } from 'react'
import axios from 'axios'

export default function TicketForm() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    flightNo: '',
    departure: '',
    arrival: '',
    depTime: '',
    boardTime: '',
    seat: '',
    zone: '',
    sequence: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.post('/api/ticket', form)
    if (res.status === 200) {
      setSubmitted(true)
      setForm({
        email: '',
        phone: '',
        flightNo: '',
        departure: '',
        arrival: '',
        depTime: '',
        boardTime: '',
        seat: '',
        zone: '',
        sequence: '',
      })
    }
  }

  const fieldOrder = [
    'email', 'phone', 'flightNo', 'departure', 'arrival',
    'depTime', 'boardTime', 'seat', 'zone', 'sequence'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-6 pt-20">
      <div className="w-full max-w-lg bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">🧾 Enter Ticket Info</h2>

        {submitted && (
          <div className="text-white text-center font-semibold mb-4">
            ✅ Ticket saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldOrder.map((key) => (
            <input
              key={key}
              type={key.includes('Time') ? 'datetime-local' : 'text'}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key}
              required
              className="w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
            />
          ))}
          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-bold py-2 rounded-md hover:bg-blue-100 transition"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  )
}
