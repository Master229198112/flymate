'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPanel() {
  const [passengers, setPassengers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/admin/passengers')
      if (res.status === 200) {
        setPassengers(res.data)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-blue-600 p-6 pt-20 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">🛂 FlyMate Admin Panel</h1>

        {passengers.length === 0 ? (
          <p className="text-white text-center">No passengers found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm bg-white/80 shadow border-collapse rounded-md">
              <thead className="bg-blue-600 text-white text-left">
                <tr>
                  <th className="py-2 px-4">Reference</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p._id} className="border-b border-gray-300 hover:bg-white/50 transition">
                    <td className="py-2 px-4 font-mono">{p.reference}</td>
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4">{p.email}</td>
                    <td className="py-2 px-4">{p.phone}</td>
                    <td className="py-2 px-4">
                      {p.status?.map((s, i) => (
                        <span
                          key={i}
                          className="inline-block bg-white/70 text-blue-800 text-xs font-semibold px-2 py-1 mr-1 mb-1 rounded shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
