'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../components/LecturerLayout'
import { FaChartBar, FaUserGraduate, FaCalendar, FaSun, FaMoon } from 'react-icons/fa'
import UpcomingClasses from '../components/UpcomingClasses'

export default function DashboardPage() {
  const router = useRouter()
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null

  useEffect(() => {
    if (!userRole) {
      router.push('/')
    }
  }, [userRole, router])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    router.push('/')
  }

  if (!userRole) return null

  const isLecturer = userRole === 'lecturer'

  const stats = isLecturer ? [
    { label: 'Total Students', value: '150', icon: FaUserGraduate },
    { label: 'Active Classes', value: '4', icon: FaChartBar },
    { label: 'Attendance Rate', value: '92%', icon: FaCalendar },
  ] : [
    { label: 'Enrolled Classes', value: '5', icon: FaChartBar },
    { label: 'Attendance Rate', value: '95%', icon: FaCalendar },
    { label: 'Average Grade', value: 'A-', icon: FaChartBar },
  ]

  return (
    <DashboardLayout userRole={userRole as 'student' | 'lecturer'} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Upcoming Classes Section */}
        <UpcomingClasses isDarkMode={false} />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <stat.icon className="text-2xl text-blue-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        {isLecturer ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">CS101 Attendance Updated</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">New Grade Posted - CS202</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">CS101 - Introduction to Programming</p>
                  <p className="text-sm text-gray-500">Today, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">MATH201 - Linear Algebra</p>
                  <p className="text-sm text-gray-500">Today, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 