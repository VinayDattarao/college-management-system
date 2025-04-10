import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')
    const classroomId = searchParams.get('classroomId')
    const date = searchParams.get('date')

    if (studentId && subjectId && classroomId && date) {
      const attendance = await prisma.attendance.findUnique({
        where: {
          studentId_subjectId_classroomId_date: {
            studentId,
            subjectId,
            classroomId,
            date: new Date(date)
          }
        }
      })
      return NextResponse.json(attendance)
    }

    const attendance = await prisma.attendance.findMany({
      include: {
        student: true,
        subject: true,
        classroom: true
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
    const { studentId, subjectId, classroomId, date, present } = body

    const attendance = await prisma.attendance.upsert({
      where: {
        studentId_subjectId_classroomId_date: {
          studentId,
          subjectId,
          classroomId,
          date: new Date(date)
        }
      },
      update: {
        present
      },
      create: {
        studentId,
        subjectId,
        classroomId,
        date: new Date(date),
        present
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