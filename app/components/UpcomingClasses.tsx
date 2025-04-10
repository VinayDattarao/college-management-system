import { useState, useEffect } from 'react'
import { format, addDays, parse, differenceInHours, differenceInMinutes, isWithinInterval, startOfDay, endOfDay, addHours } from 'date-fns'
import { FaClock, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa'
import { formatInTimeZone } from 'date-fns-tz'

interface TimeSlot {
  day: string
  startTime: string
  endTime: string
  subject: string
  classCode: string
  className: string
  facultyName: string
  periodNumber: number
}

interface ClassSchedule {
  id: string
  name: string
  classCode: string
  schedule: TimeSlot[]
}

const COLORS = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-cyan-600'
]

const SATURDAY_SCHEDULE: TimeSlot[] = [
  {
    day: 'Saturday',
    startTime: '11:20',
    endTime: '12:10',
    subject: 'COI',
    classCode: 'CSE-A',
    className: 'Computer Science',
    facultyName: 'Mr. RJV',
    periodNumber: 3
  },
  {
    day: 'Saturday',
    startTime: '12:10',
    endTime: '13:00',
    subject: 'OS',
    classCode: 'CSE-A',
    className: 'Computer Science',
    facultyName: 'Mr. Ahmed Pasha',
    periodNumber: 4
  },
  {
    day: 'Saturday',
    startTime: '13:50',
    endTime: '14:45',
    subject: 'DM',
    classCode: 'CSE-A',
    className: 'Computer Science',
    facultyName: 'Mrs. Sirisha',
    periodNumber: 5
  },
  {
    day: 'Saturday',
    startTime: '14:45',
    endTime: '15:40',
    subject: 'Sports',
    classCode: 'CSE-A',
    className: 'Computer Science',
    facultyName: 'Physical Director',
    periodNumber: 6
  }
]

const formatTimeToAMPM = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const getIndianTime = (date: Date) => {
  // Create a new date with Indian timezone offset
  const indianDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return indianDate
}

export default function UpcomingClasses({ isDarkMode }: { isDarkMode: boolean }) {
  const [upcomingClasses, setUpcomingClasses] = useState<(TimeSlot & { 
    timeToGo: string
    hoursToGo: number
    minutesToGo: number
    isToday: boolean
    colorIndex: number
    displayTime: string
  })[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadUpcomingClasses = () => {
      const indianTime = getIndianTime(new Date())
      const nextSaturday = new Date(indianTime)
      
      // Find the next Saturday
      while (nextSaturday.getDay() !== 6) { // 6 is Saturday
        nextSaturday.setDate(nextSaturday.getDate() + 1)
      }
      
      const upcoming: (TimeSlot & { 
        timeToGo: string
        hoursToGo: number
        minutesToGo: number
        isToday: boolean
        colorIndex: number
        displayTime: string
      })[] = []

      SATURDAY_SCHEDULE.forEach((slot, index) => {
        const [startHour, startMinute] = slot.startTime.split(':').map(Number)
        const slotDateTime = new Date(nextSaturday)
        slotDateTime.setHours(startHour, startMinute, 0)

        // Convert to Indian time for comparison
        const slotIndianTime = getIndianTime(slotDateTime)
        const currentIndianTime = getIndianTime(currentTime)

        const hoursToGo = differenceInHours(slotIndianTime, currentIndianTime)
        const minutesToGo = differenceInMinutes(slotIndianTime, currentIndianTime) % 60

        if (slot.subject.toLowerCase() !== 'lunch') {
          upcoming.push({
            ...slot,
            timeToGo: `${hoursToGo}h ${minutesToGo}m to go`,
            hoursToGo,
            minutesToGo,
            isToday: isWithinInterval(slotIndianTime, {
              start: startOfDay(currentIndianTime),
              end: endOfDay(currentIndianTime)
            }),
            colorIndex: index % COLORS.length,
            displayTime: `${formatTimeToAMPM(slot.startTime)} - ${formatTimeToAMPM(slot.endTime)} IST`
          })
        }
      })

      setUpcomingClasses(upcoming)
    }

    loadUpcomingClasses()
    // Reload every minute
    const interval = setInterval(loadUpcomingClasses, 60000)
    return () => clearInterval(interval)
  }, [currentTime])

  if (upcomingClasses.length === 0) {
    return (
      <div className={`p-6 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" />
          Upcoming Classes
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No upcoming classes scheduled</p>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaCalendarAlt className="mr-2" />
        Upcoming Classes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingClasses.map((cls, index) => (
          <div
            key={`${cls.className}-${cls.startTime}-${index}`}
            className={`p-4 rounded-lg bg-gradient-to-br ${COLORS[cls.colorIndex]} 
              shadow-lg transform transition-all duration-300 hover:scale-105
              ${isDarkMode ? 'opacity-90' : 'opacity-100'}`}
          >
            <div className="text-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{cls.subject}</h3>
                  <p className="text-sm opacity-90">
                    <FaGraduationCap className="inline mr-1" />
                    {cls.className} ({cls.classCode})
                  </p>
                  <p className="text-sm opacity-90 mt-1 font-medium">
                    Faculty: {cls.facultyName}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    cls.hoursToGo <= 1
                      ? 'bg-red-100 text-red-800'
                      : cls.isToday
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  } font-medium block mb-2`}>
                    {cls.timeToGo}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    Period {cls.periodNumber}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-sm opacity-90">
                <FaClock className="mr-1" />
                <span>{cls.displayTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 