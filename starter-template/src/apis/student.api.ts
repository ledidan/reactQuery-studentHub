import { Students, Student } from '../types/student.type'
import http from 'utils/http'
export const getStudent = (page: number | string, limit: number | string) =>
  http.get<Students>('students', {
    params: {
      _page: page,
      limit: limit
    }
  })
export const getStudentId = (id: number | string) => http.get<Student>(`students/${id}`)

export const addStudent = (student: Omit<Student, 'id'>) => {
  return http.post<Student>('students', student)
}

export const updateStudent = (id: number | string, student: Student) => http.put<Student>(`students/${id}`, student)
