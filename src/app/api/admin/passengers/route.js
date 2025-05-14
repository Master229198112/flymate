import { connectDB } from '@/lib/dbConnect'
import Passenger from '@/models/Passenger'

export async function GET() {
  try {
    await connectDB()
    const passengers = await Passenger.find().sort({ checkinTime: -1 })
    return Response.json(passengers)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Failed to fetch passengers' }, { status: 500 })
  }
}
