import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const classId = searchParams.get('classId')
    const studentId = searchParams.get('studentId')
    const date = searchParams.get('date')

    if (userId && classId && studentId && date) {
      const attendance = await prisma.attendance.findUnique({
        where: {
          userId_classId_studentId_date: {
            userId,
            classId,
            studentId,
            date: new Date(date)
          }
        }
      })
      return NextResponse.json(attendance)
    }

    const attendance = await prisma.attendance.findMany({
      include: {
        user: true,
        class: true,
        student: true
      }
    })
    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, classId, studentId, date, status } = body

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_classId_studentId_date: {
          userId,
          classId,
          studentId,
          date: new Date(date)
        }
      },
      update: {
        status
      },
      create: {
        userId,
        classId,
        studentId,
        date: new Date(date),
        status
      }
    })

    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 })
    }

    await prisma.attendance.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Attendance deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attendance' }, { status: 500 })
  }
} 