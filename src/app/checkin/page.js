'use client'
import { useEffect, useState } from 'react'
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaPassport
} from 'react-icons/fa'

export default function CheckinPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', idProof: '', passport: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
      setReference(data.reference)
    } else {
      setError(data.error || 'Check-in failed')
    }
  }

  useEffect(() => {
    if (!reference) return
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket?reference=${reference}`)
        if (!res.ok) {
          console.error(`Failed to fetch ticket. Status: ${res.status}`)
          return
        }
  
        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Response is not JSON")
          return
        }
  
        const data = await res.json()
        setTicket(data)
      } catch (err) {
        console.error("Error fetching ticket:", err)
      }
    }
    fetchTicket()
  }, [reference])
  

  const fields = [
    { field: 'name', label: 'Full Name', icon: <FaUser /> },
    { field: 'email', label: 'Email Address', icon: <FaEnvelope /> },
    { field: 'phone', label: 'Mobile Number', icon: <FaPhone /> },
    { field: 'address', label: 'Current Address', icon: <FaUser /> },
    { field: 'idProof', label: 'ID Card Number', icon: <FaIdCard /> },
    { field: 'passport', label: 'Passport Number', icon: <FaPassport /> },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-4 pt-20">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">Passenger Check-In</h2>

        {error && <p className="text-red-200 text-sm text-center mb-2">{error}</p>}

        {submitted ? (
          <div className="text-white text-center font-semibold space-y-4">
            ✅ Check-in complete!<br />
            ✈️ Reference No: <strong>{reference}</strong><br />
            📧 Boarding Pass has been emailed to you.

            <button
              className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-100"
              onClick={async () => {
                const res = await fetch('/api/boarding-pass', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reference }),
                })
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `boarding-pass-${reference}.pdf`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
            >
              Download Boarding Pass
            </button>

            {ticket && (
              <div className="bg-white/20 text-white mt-6 p-4 rounded shadow space-y-2">
                <h3 className="text-lg font-bold">🧾 Ticket Details</h3>
                <p><strong>Flight:</strong> {ticket.flightNo}</p>
                <p><strong>From:</strong> {ticket.departure}</p>
                <p><strong>To:</strong> {ticket.arrival}</p>
                <p><strong>Boarding Time:</strong> {ticket.boardTime}</p>
                <p><strong>Departure Time:</strong> {ticket.depTime}</p>
                <p><strong>Seat:</strong> {ticket.seat} | <strong>Zone:</strong> {ticket.zone}</p>
                <hr className="border-white/40" />
                <h3 className="text-lg font-bold mt-2">📍 Quick Links</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=Rajiv+Gandhi+International+Airport`}
                      className="underline text-blue-200"
                      target="_blank"
                    >
                      Check Distance & Route to Airport
                    </a>
                  </li>
                  <li><a href="#" className="underline text-blue-200">Book Uber/Ola Ride</a></li>
                  <li><a href="#" className="underline text-blue-200">Reserve Premium Lounge</a></li>
                  <li><a href="#" className="underline text-blue-200">Book XR Experience</a></li>
                  <li><a href="#" className="underline text-blue-200">Order Veg Meal</a></li>
                  <li><a href="#" className="underline text-blue-200">Order Non-Veg Meal</a></li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ field, label, icon }) => (
              <div key={field} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">{icon}</div>
                <input
                  type="text"
                  name={field}
                  placeholder={label}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full border border-white/50 bg-white/20 text-white placeholder-white/70 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            ))}
            <button type="submit" className="w-full bg-white text-pink-600 font-bold py-2 rounded-md hover:bg-pink-100 transition">
              Submit Check-In
            </button>
          </form>
        )}
      </div>
    </div>
  )
}