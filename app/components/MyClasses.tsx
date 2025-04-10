'use client'

import { useState, useEffect } from 'react'
import { FaCalendar, FaClock, FaInfoCircle } from 'react-icons/fa'

interface Class {
  id: string
  name: string
  code: string
  time: string
  day: string
  room: string
  lecturer: string
}

export default function MyClasses() {
  const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextClass, setNextClass] = useState<Class | null>(null)
  const [timeUntilNextClass, setTimeUntilNextClass] = useState<string>('')

  useEffect(() => {
    // Load demo data
    const demoClasses: Class[] = [
      {
        id: '1',
        name: 'Discrete Mathematics',
        code: 'DM',
        time: '09:00 AM',
        day: 'Monday',
        room: 'Room 320',
        lecturer: 'Mrs. Sirisha'
      },
      {
        id: '2',
        name: 'Operating Systems',
        code: 'OS',
        time: '11:00 AM',
        day: 'Wednesday',
        room: 'Room 320',
        lecturer: 'Mr. Ahmed Pasha'
      },
      {
        id: '3',
        name: 'Database Management Systems',
        code: 'DBMS',
        time: '02:00 PM',
        day: 'Friday',
        room: 'Room 320',
        lecturer: 'Mrs. Arpitha'
      }
    ]

    setUpcomingClasses(demoClasses)

    // Update current time every minute
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      updateNextClass(now, demoClasses)
    }, 60000)

    // Initial update
    updateNextClass(currentTime, demoClasses)

    return () => clearInterval(timer)
  }, [])

  const updateNextClass = (now: Date, classes: Class[]) => {
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
    const currentTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const nextClass = classes.find(cls => {
      if (cls.day === currentDay) {
        const classTime = new Date()
        const [time, period] = cls.time.split(' ')
        const [hours, minutes] = time.split(':')
        classTime.setHours(
          period === 'PM' && parseInt(hours) !== 12 
            ? parseInt(hours) + 12 
            : parseInt(hours)
        )
        classTime.setMinutes(parseInt(minutes))
        return classTime > now
      }
      return false
    })

    setNextClass(nextClass || null)

    if (nextClass) {
      const [time, period] = nextClass.time.split(' ')
      const [hours, minutes] = time.split(':')
      const classTime = new Date()
      classTime.setHours(
        period === 'PM' && parseInt(hours) !== 12 
          ? parseInt(hours) + 12 
          : parseInt(hours)
      )
      classTime.setMinutes(parseInt(minutes))

      const diff = classTime.getTime() - now.getTime()
      const hoursUntil = Math.floor(diff / (1000 * 60 * 60))
      const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      setTimeUntilNextClass(
        hoursUntil > 0 
          ? `${hoursUntil}h ${minutesUntil}m` 
          : `${minutesUntil}m`
      )
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Classes</h2>

      {nextClass && (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Next Class
          </h3>
          <div className="flex items-center space-x-4">
            <FaClock className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-blue-900 dark:text-blue-100 font-medium">
                {nextClass.name} ({nextClass.code})
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {nextClass.time} - {nextClass.room}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Starting in {timeUntilNextClass}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {upcomingClasses.map((cls) => (
          <div
            key={cls.id}
            className={`p-4 rounded-lg transition-colors ${
              cls.id === nextClass?.id
                ? 'bg-blue-50 dark:bg-blue-900/50'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {cls.name} ({cls.code})
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {cls.lecturer}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <FaCalendar />
                  <span>{cls.day}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {cls.time} - {cls.room}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 