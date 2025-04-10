'use client'

import { useState, useEffect } from 'react'
import { FaSave, FaFileExcel, FaDownload } from 'react-icons/fa'
import * as XLSX from 'xlsx'

interface Grade {
  rollNo: string;
  name: string;
  assignments: number;
  midterm: number;
  final: number;
  total: number;
  grade: string;
}

interface GradeManagementProps {
  userRole: 'student' | 'lecturer';
  studentId?: string;
}

export default function GradeManagement({ userRole, studentId }: GradeManagementProps) {
  const [selectedClass, setSelectedClass] = useState('')
  const [grades, setGrades] = useState<Grade[]>([])
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPDF, setShowPDF] = useState(false)

  // Demo data
  const classes = [
    { id: 'CS101', name: 'Introduction to Programming' },
    { id: 'CS102', name: 'Data Structures' },
    { id: 'CS103', name: 'Database Management' }
  ]

  const calculateGrade = (total: number): string => {
    if (total >= 90) return 'A'
    if (total >= 80) return 'B'
    if (total >= 70) return 'C'
    if (total >= 60) return 'D'
    return 'F'
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setIsLoading(true)
      try {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Validate and transform the data
        const validatedGrades = jsonData.map((row: any) => {
          if (!row['Roll No'] || !row['Name'] || !row['Assignments'] || !row['Midterm'] || !row['Final']) {
            throw new Error('Invalid Excel format. Required columns: Roll No, Name, Assignments, Midterm, Final')
          }

          const assignments = Number(row['Assignments'])
          const midterm = Number(row['Midterm'])
          const final = Number(row['Final'])
          const total = (assignments * 0.3) + (midterm * 0.3) + (final * 0.4)

          return {
            rollNo: row['Roll No'].toString(),
            name: row['Name'],
            assignments,
            midterm,
            final,
            total,
            grade: calculateGrade(total)
          }
        })

        setGrades(validatedGrades)
        setError('')
      } catch (err) {
        setError(err.message || 'Error parsing Excel file')
        setSelectedFile(null)
        setGrades([])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const downloadTemplate = () => {
    const template = [
      { 
        'Roll No': 'S1001', 
        'Name': 'John Doe', 
        'Assignments': 85,
        'Midterm': 78,
        'Final': 92
      }
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Grades')
    XLSX.writeFile(wb, 'grades_template.xlsx')
  }

  const handleSaveGrades = () => {
    if (!selectedClass) {
      setError('Please select a class')
      return
    }

    if (grades.length === 0) {
      setError('No grades to save')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Saving grades:', { classId: selectedClass, grades })
      alert('Grades saved successfully!')
      setIsLoading(false)
    }, 1000)
  }

  if (userRole === 'student') {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Results</h2>
        
        <div className="flex justify-center">
          <button
            onClick={() => setShowPDF(!showPDF)}
            className="btn-primary"
          >
            {showPDF ? 'Hide Results' : 'View Results'}
          </button>
        </div>

        {showPDF && (
          <div className="mt-6">
            <iframe
              src="https://drive.google.com/file/d/1KEnFmiPk993XhNjHfuoH9CUJLnX6_H3O/preview"
              width="100%"
              height="600px"
              className="rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Grade Management</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={downloadTemplate}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaDownload />
            <span>Download Template</span>
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Grades
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="btn-secondary flex items-center space-x-2 cursor-pointer"
              >
                <FaFileExcel />
                <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
              </label>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="loading-spinner" />
          </div>
        )}

        {grades.length > 0 && (
          <>
            <div className="table-container mt-6">
              <table className="table">
                <thead>
                  <tr>
                    <th className="table-header">Roll No</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Assignments (30%)</th>
                    <th className="table-header">Midterm (30%)</th>
                    <th className="table-header">Final (40%)</th>
                    <th className="table-header">Total</th>
                    <th className="table-header">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {grades.map((student) => (
                    <tr key={student.rollNo}>
                      <td className="table-cell">{student.rollNo}</td>
                      <td className="table-cell">{student.name}</td>
                      <td className="table-cell">{student.assignments}</td>
                      <td className="table-cell">{student.midterm}</td>
                      <td className="table-cell">{student.final}</td>
                      <td className="table-cell">{student.total.toFixed(1)}</td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${student.grade === 'A' ? 'grade-A' :
                            student.grade === 'B' ? 'grade-B' :
                            student.grade === 'C' ? 'grade-C' :
                            student.grade === 'D' ? 'grade-D' :
                            'grade-F'}`}>
                          {student.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveGrades}
                disabled={isLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                <span>{isLoading ? 'Saving...' : 'Save Grades'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 