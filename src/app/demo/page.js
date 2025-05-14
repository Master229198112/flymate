'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaPlaneArrival, FaCarAlt, FaCouch, FaVrCardboard,
  FaUtensils, FaDrumstickBite, FaTrashAlt
} from 'react-icons/fa'

const SERVICES = [
  { label: 'Entered Airport', icon: <FaPlaneArrival /> },
  { label: 'Booked Ride (Uber/Ola)', icon: <FaCarAlt /> },
  { label: 'Booked Premium Waiting Lounge', icon: <FaCouch /> },
  { label: 'Booked XR Experience (Discount)', icon: <FaVrCardboard /> },
  { label: 'Booked Special Veg Meal', icon: <FaUtensils /> },
  { label: 'Booked Special Non-Veg Meal', icon: <FaDrumstickBite /> },
]

export default function DemoPage() {
  const [reference, setReference] = useState('')
  const [log, setLog] = useState([])

  // Load latest passenger reference automatically
  useEffect(() => {
    const fetchLatest = async () => {
      const res = await axios.get('/api/admin/passengers')
      if (res.status === 200 && res.data.length > 0) {
        setReference(res.data[0].reference)
      }
    }
    fetchLatest()
  }, [])

  const sendStatus = async (status) => {
    if (!reference) return alert('Enter a reference number first')
    const now = new Date().toLocaleTimeString()

    const res = await axios.post('/api/admin/update-status', { reference, status })
    if (res.status === 200) {
      setLog((prev) => [...prev, { text: `✅ ${status} at ${now}`, success: true }])
    } else {
      setLog((prev) => [...prev, { text: `❌ Failed to update: ${status} at ${now}`, success: false }])
    }
  }

  const clearLog = () => setLog([])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 p-6 pt-20">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">
          🎮 FlyMate Demo Simulation Panel
        </h2>

        <input
          placeholder="Enter Passenger Reference (e.g., JYOT-0001)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full mb-6 p-2 rounded-md border border-white/50 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {SERVICES.map((item, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-blue-100 transition"
              onClick={() => sendStatus(item.label)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <strong className="text-white text-lg">Status Log:</strong>
          <button
            className="flex items-center gap-2 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={clearLog}
          >
            <FaTrashAlt /> Clear Log
          </button>
        </div>

        <div className="text-white font-mono text-sm bg-black/30 rounded p-4 max-h-64 overflow-y-auto">
          <ul className="list-disc pl-6 mt-2 space-y-1">
            {log.map((entry, idx) => (
              <li key={idx} className={entry.success ? 'text-green-300' : 'text-red-400'}>
                {entry.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
