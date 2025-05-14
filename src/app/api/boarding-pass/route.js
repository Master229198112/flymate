import { connectDB } from '@/lib/dbConnect'
import Passenger from '@/models/Passenger'
import Ticket from '@/models/Ticket'
import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

export async function POST(req) {
  await connectDB()
  const { reference } = await req.json()

  const passenger = await Passenger.findOne({ reference })
  const ticket = await Ticket.findOne({ reference })
  if (!passenger || !ticket) {
    return Response.json({ error: 'Invalid reference' }, { status: 404 })
  }

  const doc = new PDFDocument()
  let buffers = []
  doc.on('data', buffers.push.bind(buffers))
  doc.on('end', () => {})

  doc.fontSize(20).text('Boarding Pass', { align: 'center' })
  doc.moveDown()
  doc.fontSize(14)
  doc.text(`Name: ${passenger.name}`)
  doc.text(`PNR: ${reference}`)
  doc.text(`Flight No: ${ticket.flightNo}`)
  doc.text(`Depart: ${ticket.departure}`)
  doc.text(`Arrive: ${ticket.arrival}`)
  doc.text(`Boarding Time: ${ticket.boardTime}`)
  doc.text(`Departure Time: ${ticket.depTime}`)
  doc.text(`Seat No: ${ticket.seat}`)
  doc.text(`Zone: ${ticket.zone}`)
  doc.text(`Sequence: ${ticket.sequence}`)
  doc.end()

  const pdfBuffer = await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)))
  })

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=boarding-pass-${reference}.pdf`,
    },
  })
}
