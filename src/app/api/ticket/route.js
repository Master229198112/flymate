import { connectDB } from '@/lib/dbConnect'
import Ticket from '@/models/Ticket'

export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const {
    email,
    phone,
    flightNo,
    departure,
    arrival,
    depTime,
    boardTime,
    seat,
    zone,
    sequence
  } = body

  if (!email || !phone) {
    return Response.json({ error: 'Email and Phone are required' }, { status: 400 })
  }

  await Ticket.create({
    email,
    phone,
    flightNo,
    departure,
    arrival,
    depTime: new Date(depTime),
    boardTime: new Date(boardTime),
    seat,
    zone,
    sequence,
  })

  return Response.json({ success: true })
}

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return Response.json({ error: 'Reference is required' }, { status: 400 })
  }

  const ticket = await Ticket.findOne({ reference })

  if (!ticket) {
    return Response.json({ error: 'Ticket not found' }, { status: 404 })
  }

  return Response.json(ticket)
}
