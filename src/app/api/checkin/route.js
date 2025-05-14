import { connectDB } from '@/lib/dbConnect'
import Passenger from '@/models/Passenger'
import Ticket from '@/models/Ticket'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import PDFDocument from 'pdfkit'

export async function POST(req) {
  try {
    await connectDB()
    const { name, email, phone, address, idProof, passport } = await req.json()

    // Step 1: Match ticket with email and phone
    const ticket = await Ticket.findOne({ email, phone })
    if (!ticket) {
      return Response.json({ error: 'No ticket found for the provided email and phone number.' }, { status: 404 })
    }

    // Step 2: Generate unique reference
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const countToday = await Passenger.countDocuments({ checkinTime: { $gte: today } })
    const serial = (countToday + 1).toString().padStart(4, '0')
    const reference = `${name.slice(0, 4).toUpperCase()}-${serial}`
    const checkinTime = new Date()

    // Step 3: Save passenger record
    await Passenger.create({
      name, email, phone, address, idProof, passport,
      reference, checkinTime,
      status: ['Check-in Done']
    })

    // Step 4: Update ticket with reference
    ticket.reference = reference
    await ticket.save()

    // Step 5: Generate boarding pass PDF
    const nextConfig = {
        experimental: {
          serverComponentsExternalPackages: ["pdfkit"],
        },
      };
    const doc = new PDFDocument()
    let buffers = []
    doc.on('data', buffers.push.bind(buffers))
    doc.fontSize(20).text('Boarding Pass', { align: 'center' }).moveDown()
    doc.fontSize(14)
    doc.text(`Name: ${name}`)
    doc.text(`PNR: ${reference}`)
    doc.text(`Flight No: ${ticket.flightNo}`)
    doc.text(`Depart: ${ticket.departure}`)
    doc.text(`Arrive: ${ticket.arrival}`)
    doc.text(`Boarding Time: ${new Date(ticket.boardTime).toLocaleString('en-IN')}`)
    doc.text(`Departure Time: ${new Date(ticket.depTime).toLocaleString('en-IN')}`)    
    doc.text(`Seat No: ${ticket.seat}`)
    doc.text(`Zone: ${ticket.zone}`)
    doc.text(`Sequence: ${ticket.sequence}`)
    doc.end()

    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)))
    })

    // Step 6: Send email with boarding pass
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Boarding Pass - FlyMate',
      text: `Hi ${name}, your boarding pass is attached. Reference: ${reference}`,
      attachments: [
        {
          filename: `boarding-pass-${reference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })

    // Step 7: Send SMS confirmation
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    await twilioClient.messages.create({
      body: `Hi ${name}, check-in confirmed. Ref: ${reference}. Boarding pass sent to your email.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`
    })

    return Response.json({ success: true, reference })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Check-in failed' }, { status: 500 })
  }
}
