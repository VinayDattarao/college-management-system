'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCalendar, FaUserGraduate, FaChalkboardTeacher, FaBell, FaUser, FaLock, FaBook, FaChartBar } from 'react-icons/fa'
import bcrypt from 'bcryptjs'

interface LecturerData {
  username: string
  password: string
  name: string
  email: string
}

export default function Home() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [rollNumber, setRollNumber] = useState('')
  const [classCode, setClassCode] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [classrooms, setClassrooms] = useState([])
  const [showLecturerLogin, setShowLecturerLogin] = useState(false)
  const [showLecturerRegister, setShowLecturerRegister] = useState(false)
  const [lecturerLoginData, setLecturerLoginData] = useState({
    username: '',
    password: ''
  })
  const [lecturerRegisterData, setLecturerRegisterData] = useState<LecturerData>({
    username: '',
    password: '',
    name: '',
    email: ''
  })
  const [error, setError] = useState('')

  // Add useEffect to check for saved credentials
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedStudentCredentials')
    if (savedCredentials) {
      const { rollNumber: savedRoll, classCode: savedClass } = JSON.parse(savedCredentials)
      setRollNumber(savedRoll)
      setClassCode(savedClass)
      setRememberMe(true)
    }
  }, [])

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    if (role === 'lecturer') {
      setShowLecturerLogin(true)
    }
  }

  const handleStudentLogin = () => {
    if (!rollNumber || !classCode) {
      setError('Please fill in all fields')
      return
    }

    const savedClassrooms = localStorage.getItem('classrooms') || '[]'
    const classrooms = JSON.parse(savedClassrooms)
    
    const classroom = classrooms.find((c: any) => c.classCode === classCode)
    if (!classroom) {
      setError('Invalid class code')
      return
    }

    const student = classroom.students.find((s: any) => s.rollNumber === rollNumber)
    if (!student) {
      setError('Invalid roll number for this class')
      return
    }

    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem('savedStudentCredentials', JSON.stringify({
        rollNumber,
        classCode
      }))
    } else {
      localStorage.removeItem('savedStudentCredentials')
    }

    localStorage.setItem('userRole', 'student')
    localStorage.setItem('studentName', student.name)
    localStorage.setItem('rollNumber', student.rollNumber)
    localStorage.setItem('classroomId', classroom.id)
    router.push('/dashboard')
  }

  const handleLecturerLogin = () => {
    if (!lecturerLoginData.username || !lecturerLoginData.password) {
      setError('Please fill in all fields')
      return
    }

    const savedLecturers = localStorage.getItem('lecturers') || '[]'
    const lecturers = JSON.parse(savedLecturers)
    
    const lecturer = lecturers.find((l: LecturerData) => l.username === lecturerLoginData.username)
    
    if (!lecturer) {
      setError('Invalid username or password')
      return
    }

    const isPasswordValid = bcrypt.compareSync(lecturerLoginData.password, lecturer.password)
    
    if (!isPasswordValid) {
      setError('Invalid username or password')
      return
    }

    localStorage.setItem('userRole', 'lecturer')
    localStorage.setItem('lecturerId', lecturer.id)
    localStorage.setItem('lecturerName', lecturer.name)
    router.push('/dashboard')
  }

  const handleLecturerRegister = async () => {
    try {
      // Validate input
      if (!lecturerRegisterData.username || !lecturerRegisterData.password || 
          !lecturerRegisterData.name || !lecturerRegisterData.email) {
        setError('Please fill in all fields')
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(lecturerRegisterData.email)) {
        setError('Please enter a valid email address')
        return
      }

      const savedLecturers = localStorage.getItem('lecturers') || '[]'
      const lecturers = JSON.parse(savedLecturers)

      // Check if username or email already exists
      if (lecturers.some((l: LecturerData) => l.username === lecturerRegisterData.username)) {
        setError('Username already exists')
        return
      }

      if (lecturers.some((l: LecturerData) => l.email === lecturerRegisterData.email)) {
        setError('Email already exists')
        return
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(lecturerRegisterData.password, 10)

      // Create new lecturer account
      const newLecturer = {
        id: Date.now().toString(),
        username: lecturerRegisterData.username,
        password: hashedPassword,
        name: lecturerRegisterData.name,
        email: lecturerRegisterData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage
      lecturers.push(newLecturer)
      localStorage.setItem('lecturers', JSON.stringify(lecturers))

      // Clear form and show success
      setLecturerRegisterData({
        username: '',
        password: '',
        name: '',
        email: ''
      })
      setError('Registration successful! Please login.')
      setShowLecturerRegister(false)
      setShowLecturerLogin(true)
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred during registration')
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side - Login Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              Visi Coders
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Manage your academic life with ease</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {!selectedRole && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('student')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <FaUserGraduate className="h-8 w-8 text-blue-500" />
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Student</span>
              </button>
              <button
                onClick={() => handleRoleSelect('lecturer')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <FaChalkboardTeacher className="h-8 w-8 text-blue-500" />
                <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Lecturer</span>
              </button>
            </div>
          )}

          {selectedRole === 'student' && (
            <div className="mt-8">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="class-code" className="sr-only">Class Code</label>
                  <input
                    id="class-code"
                    type="text"
                    required
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Class Code"
                  />
                </div>
                <div>
                  <label htmlFor="roll-number" className="sr-only">Roll Number</label>
                  <input
                    id="roll-number"
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Roll Number"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 mb-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleStudentLogin}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login as Student
                </button>
              </div>
            </div>
          )}

          {selectedRole === 'lecturer' && !showLecturerRegister && showLecturerLogin && (
            <div className="mt-8">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    type="text"
                    required
                    value={lecturerLoginData.username}
                    onChange={(e) => setLecturerLoginData({...lecturerLoginData, username: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={lecturerLoginData.password}
                    onChange={(e) => setLecturerLoginData({...lecturerLoginData, password: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <button
                  onClick={handleLecturerLogin}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login as Lecturer
                </button>
                <button
                  onClick={() => {
                    setShowLecturerLogin(false)
                    setShowLecturerRegister(true)
                    setError('')
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register New Account
                </button>
              </div>
            </div>
          )}

          {selectedRole === 'lecturer' && showLecturerRegister && (
            <div className="mt-8">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="reg-username" className="sr-only">Username</label>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={lecturerRegisterData.username}
                    onChange={(e) => setLecturerRegisterData({...lecturerRegisterData, username: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="sr-only">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={lecturerRegisterData.password}
                    onChange={(e) => setLecturerRegisterData({...lecturerRegisterData, password: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="reg-name" className="sr-only">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={lecturerRegisterData.name}
                    onChange={(e) => setLecturerRegisterData({...lecturerRegisterData, name: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="sr-only">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={lecturerRegisterData.email}
                    onChange={(e) => setLecturerRegisterData({...lecturerRegisterData, email: e.target.value})}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <button
                  onClick={handleLecturerRegister}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register Account
                </button>
                <button
                  onClick={() => {
                    setShowLecturerRegister(false)
                    setShowLecturerLogin(true)
                    setError('')
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {selectedRole && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedRole('')
                  setShowLecturerLogin(false)
                  setShowLecturerRegister(false)
                  setError('')
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                ← Change Role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Features */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 p-12 flex items-center">
        <div className="max-w-lg mx-auto text-white">
          <h2 className="text-4xl font-bold mb-6">Streamline College Management</h2>
          <p className="text-xl mb-12 text-blue-100">
            Visi Coders is an all-in-one platform that simplifies attendance tracking, 
            class management, and communication between students and lecturers.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaUserGraduate className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">QR Attendance</h3>
              <p className="text-blue-100">Track attendance with secure QR codes and location verification</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaCalendar className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Timetable</h3>
              <p className="text-blue-100">Access your class schedule anytime, anywhere</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaBook className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Course Materials</h3>
              <p className="text-blue-100">Get instant access to lecture notes and resources</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaChartBar className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Grades & Feedback</h3>
              <p className="text-blue-100">Monitor academic progress throughout the semester</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 