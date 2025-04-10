'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '../components/BackButton'

interface TimeSlot {
  time: string
  subject: string
  lecturer: string
}

interface DaySchedule {
  day: string
  slots: TimeSlot[]
}

export default function Timetable() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })

  const timetable: DaySchedule[] = [
    {
      day: 'Monday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'DM', lecturer: 'Mrs. Sirisha' },
        { time: '10:20 AM - 11:10 AM', subject: 'Comm-Skills', lecturer: 'Mr. Fakhruddin Ali' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
        { time: '12:10 PM - 01:00 PM', subject: 'DBMS', lecturer: 'Miss. Arpitha' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'Societal Project/Seminar', lecturer: 'Mrs. Varalakshmi' },
        { time: '02:45 PM - 03:40 PM', subject: 'Societal Project/Seminar', lecturer: 'Mrs. Varalakshmi' }
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'Comm-skills', lecturer: 'Mr. Fakhruddin Ali' },
        { time: '10:20 AM - 11:10 AM', subject: 'APTITUDE', lecturer: 'Mr. RJV' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
        { time: '12:10 PM - 01:00 PM', subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' },
        { time: '02:45 PM - 03:40 PM', subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' }
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
        { time: '10:20 AM - 11:10 AM', subject: 'DBMS', lecturer: 'Miss. Arpitha' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
        { time: '12:10 PM - 01:00 PM', subject: 'Node.js', lecturer: 'Mr. Rasool Basha' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'CRT/Coding', lecturer: 'Dr. S K Mahaboob Basha' },
        { time: '02:45 PM - 03:40 PM', subject: 'CRT/Coding', lecturer: 'Dr. S K Mahaboob Basha' }
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'DBMS', lecturer: 'Miss. Arpitha' },
        { time: '10:20 AM - 11:10 AM', subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
        { time: '12:10 PM - 01:00 PM', subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' },
        { time: '02:45 PM - 03:40 PM', subject: 'OS Lab', lecturer: 'Mr. Ahmed Pasha' }
      ]
    },
    {
      day: 'Friday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'Comm-Skills', lecturer: 'Mr. Fakhruddin Ali' },
        { time: '10:20 AM - 11:10 AM', subject: 'DM', lecturer: 'Mrs. Sirisha' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'COI', lecturer: 'Mr. RJV' },
        { time: '12:10 PM - 01:00 PM', subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'DBMS Lab', lecturer: 'Miss. Arpitha' },
        { time: '02:45 PM - 03:40 PM', subject: 'DBMS Lab', lecturer: 'Miss. Arpitha' }
      ]
    },
    {
      day: 'Saturday',
      slots: [
        { time: '09:30 AM - 10:20 AM', subject: 'BEFA', lecturer: 'Ms. Vijayalakshmi' },
        { time: '10:20 AM - 11:10 AM', subject: 'SE', lecturer: 'Mrs. Vidyulatha' },
        { time: '11:10 AM - 11:20 AM', subject: 'Break', lecturer: '' },
        { time: '11:20 AM - 12:10 PM', subject: 'COI', lecturer: 'Mr. RJV' },
        { time: '12:10 PM - 01:00 PM', subject: 'OS', lecturer: 'Mr. Ahmed Pasha' },
        { time: '01:00 PM - 01:50 PM', subject: 'Lunch', lecturer: '' },
        { time: '01:50 PM - 02:45 PM', subject: 'DM', lecturer: 'Mrs. Sirisha' },
        { time: '02:45 PM - 03:40 PM', subject: 'Sports', lecturer: '' }
      ]
    }
  ]

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role) setUserRole(role)
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h1 className="text-3xl font-bold">Class Timetable</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {timetable.map((daySchedule) => (
              <div
                key={daySchedule.day}
                className={`w-80 rounded-lg overflow-hidden shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`p-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-blue-500 text-white'
                }`}>
                  <h2 className="text-xl font-semibold">{daySchedule.day}</h2>
                </div>
                <div className="p-4">
                  {daySchedule.slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm text-blue-500">{slot.time}</div>
                      <div className="font-semibold mt-1">{slot.subject}</div>
                      {slot.lecturer && (
                        <div className="text-sm text-gray-500 mt-1">{slot.lecturer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 