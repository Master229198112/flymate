import { connectDB } from '@/lib/dbConnect'
import Passenger from '@/models/Passenger'

export async function POST(req) {
  await connectDB()
  const { reference, status } = await req.json()

  const passenger = await Passenger.findOne({ reference })
  if (!passenger) {
    return Response.json({ error: 'Passenger not found' }, { status: 404 })
  }

  // Avoid duplicate status entries
  if (!passenger.status.includes(status)) {
    passenger.status.push(status)
    await passenger.save()
  }

  return Response.json({ success: true })
}
