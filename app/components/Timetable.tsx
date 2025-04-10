'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'

interface TimeSlot {
  subject: string
  lecturer: string
}

interface TimetableProps {
  userRole: string
}

const initialTimetable = {
  Monday: {
    '09:30 AM - 10:20 AM': { subject: 'DM', lecturer: 'Mrs. Sirisha' },
    '10:20 AM - 11:10 AM': { subject: 'Comm-Skills', lecturer: 'Mr. Fakhruddin Ali' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
    '12:10 PM - 01:00 PM': { subject: 'DBMS', lecturer: 'Miss. Arpitha' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'Societal Project/Seminar', lecturer: '-' },
    '02:45 PM - 03:40 PM': { subject: 'Societal Project/Seminar', lecturer: '-' }
  },
  Tuesday: {
    '09:30 AM - 10:20 AM': { subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
    '10:20 AM - 11:10 AM': { subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'DBMS', lecturer: 'Miss. Arpitha' },
    '12:10 PM - 01:00 PM': { subject: 'Aptitude', lecturer: 'Miss. Swathi' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'DM', lecturer: 'Mrs. Sirisha' },
    '02:45 PM - 03:40 PM': { subject: 'SE', lecturer: 'Mrs. Vidyulatha' }
  },
  Wednesday: {
    '09:30 AM - 10:20 AM': { subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
    '10:20 AM - 11:10 AM': { subject: 'DBMS', lecturer: 'Miss. Arpitha' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
    '12:10 PM - 01:00 PM': { subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'CRT/Coding', lecturer: 'Dr. Mahaboob Basha' },
    '02:45 PM - 03:40 PM': { subject: 'CRT/Coding', lecturer: 'Dr. Mahaboob Basha' }
  },
  Thursday: {
    '09:30 AM - 10:20 AM': { subject: 'DBMS', lecturer: 'Miss. Arpitha' },
    '10:20 AM - 11:10 AM': { subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
    '12:10 PM - 01:00 PM': { subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' },
    '02:45 PM - 03:40 PM': { subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' }
  },
  Friday: {
    '09:30 AM - 10:20 AM': { subject: 'Comm-Skills', lecturer: 'Mr. Fakhruddin Ali' },
    '10:20 AM - 11:10 AM': { subject: 'DM', lecturer: 'Mrs. Sirisha' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'COI', lecturer: 'Mr. RJV' },
    '12:10 PM - 01:00 PM': { subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'DBMS Lab', lecturer: 'Miss. Arpitha' },
    '02:45 PM - 03:40 PM': { subject: 'DBMS Lab', lecturer: 'Miss. Arpitha' }
  },
  Saturday: {
    '09:30 AM - 10:20 AM': { subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
    '10:20 AM - 11:10 AM': { subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
    '11:10 AM - 11:20 AM': { subject: 'Break', lecturer: '' },
    '11:20 AM - 12:10 PM': { subject: 'COI', lecturer: 'Mr. RJV' },
    '12:10 PM - 01:00 PM': { subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
    '01:00 PM - 01:50 PM': { subject: 'Lunch', lecturer: '' },
    '01:50 PM - 02:45 PM': { subject: 'DM', lecturer: 'Mrs. Sirisha' },
    '02:45 PM - 03:40 PM': { subject: 'Sports' }
  }
}

const timeSlots = [
  '09:30 AM - 10:20 AM',
  '10:20 AM - 11:10 AM',
  '11:10 AM - 11:20 AM',
  '11:20 AM - 12:10 PM',
  '12:10 PM - 01:00 PM',
  '01:00 PM - 01:50 PM',
  '01:50 PM - 02:45 PM',
  '02:45 PM - 03:40 PM'
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function Timetable({ userRole }: TimetableProps) {
  const [timetable, setTimetable] = useState(initialTimetable)
  const [editing, setEditing] = useState<{ day: string; time: string } | null>(null)
  const [editData, setEditData] = useState<TimeSlot>({ subject: '', lecturer: '' })

  useEffect(() => {
    const savedTimetable = localStorage.getItem('timetable')
    if (savedTimetable) {
      setTimetable(JSON.parse(savedTimetable))
    }
  }, [])

  const handleEdit = (day: string, time: string) => {
    if (userRole !== 'lecturer') return
    setEditing({ day, time })
    setEditData(timetable[day][time])
  }

  const handleSave = () => {
    if (!editing) return
    const newTimetable = {
      ...timetable,
      [editing.day]: {
        ...timetable[editing.day],
        [editing.time]: editData
      }
    }
    setTimetable(newTimetable)
    localStorage.setItem('timetable', JSON.stringify(newTimetable))
    setEditing(null)
  }

  const handleCancel = () => {
    setEditing(null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Class Timetable</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Day
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-6 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900">
                  {time}
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${time}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white relative"
                    onClick={() => handleEdit(day, time)}
                  >
                    {editing?.day === day && editing?.time === time ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editData.subject}
                          onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Subject"
                        />
                        <input
                          type="text"
                          value={editData.lecturer}
                          onChange={(e) => setEditData({ ...editData, lecturer: e.target.value })}
                          className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Lecturer"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{timetable[day][time].subject}</div>
                        {timetable[day][time].lecturer && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {timetable[day][time].lecturer}
                          </div>
                        )}
                        {userRole === 'lecturer' && timetable[day][time].subject && (
                          <button
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <FaEdit size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 