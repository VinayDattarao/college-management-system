'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BackButton from '../components/BackButton'

interface StudentProfile {
  rollNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  parentName: string
  parentPhone: string
  bloodGroup: string
  photo: string
  department: string
  semester: string
  academicYear: string
  class: string
}

export default function Profile() {
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile>({
    rollNumber: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    parentName: '',
    parentPhone: '',
    bloodGroup: '',
    photo: '',
    department: '',
    semester: '',
    academicYear: '',
    class: ''
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role || '')
    
    // For students, get their own roll number
    if (role === 'student') {
      const studentRollNumber = localStorage.getItem('rollNumber')
      if (studentRollNumber) {
        // Get student data from classrooms
        const classrooms = JSON.parse(localStorage.getItem('classrooms') || '[]')
        let studentData = null
        
        for (const classroom of classrooms) {
          const student = classroom.students.find((s: any) => s.rollNumber === studentRollNumber)
          if (student) {
            studentData = student
            break
          }
        }

        if (studentData) {
          setProfile(prev => ({
            ...prev,
            rollNumber: studentData.rollNumber,
            name: studentData.name,
            email: studentData.email,
            class: studentData.class
          }))
        }

        // Get additional profile data if it exists
        const savedProfile = localStorage.getItem(`studentProfile_${studentRollNumber}`)
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile)
          setProfile(prev => ({
            ...prev,
            ...parsedProfile
          }))
        }
      }
    } else {
      // For lecturers viewing student profiles
      const selectedStudent = localStorage.getItem('selectedStudent')
      if (selectedStudent) {
        const studentData = JSON.parse(selectedStudent)
        setProfile(prev => ({
          ...prev,
          rollNumber: studentData.rollNumber,
          name: studentData.name,
          email: studentData.email,
          class: studentData.class
        }))

        // Get additional profile data if it exists
        const savedProfile = localStorage.getItem(`studentProfile_${studentData.rollNumber}`)
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile)
          setProfile(prev => ({
            ...prev,
            ...parsedProfile
          }))
        }
      }
    }
  }, [])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }))
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (!profile.rollNumber) return

    localStorage.setItem(`studentProfile_${profile.rollNumber}`, JSON.stringify(profile))
    setHasUnsavedChanges(false)
    setSaveMessage('Profile saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.back()
      }
    } else {
      router.back()
    }
  }

  if (userRole !== 'student' && userRole !== 'lecturer') {
    return <div>Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <BackButton onClick={handleBack} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
          {userRole === 'student' && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className={`px-4 py-2 rounded-lg text-white ${
                hasUnsavedChanges 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {saveMessage}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 flex justify-center">
              <div className="relative w-32 h-32">
                {profile.photo ? (
                  <Image
                    src={profile.photo}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">👤</span>
                  </div>
                )}
                {userRole === 'student' && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={profile.rollNumber}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent/Guardian Name
              </label>
              <input
                type="text"
                name="parentName"
                value={profile.parentName}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent/Guardian Phone
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={profile.parentPhone}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleInputChange}
                disabled={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Semester
              </label>
              <input
                type="text"
                name="semester"
                value={profile.semester}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                name="academicYear"
                value={profile.academicYear}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={profile.class}
                onChange={handleInputChange}
                readOnly={userRole !== 'student'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 