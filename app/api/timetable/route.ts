import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const timetable = await prisma.timetable.findMany({
      orderBy: {
        day: 'asc',
        time: 'asc'
      }
    })
    return NextResponse.json(timetable)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { day, time, subject, lecturer } = data

    const timetable = await prisma.timetable.create({
      data: {
        day,
        time,
        subject,
        lecturer
      }
    })

    return NextResponse.json(timetable)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create timetable entry' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, day, time, subject, lecturer } = data

    const timetable = await prisma.timetable.update({
      where: { id },
      data: {
        day,
        time,
        subject,
        lecturer
      }
    })

    return NextResponse.json(timetable)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update timetable entry' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.timetable.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Timetable entry deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete timetable entry' }, { status: 500 })
  }
} 