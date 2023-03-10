import { deleteStudent, getStudent, getStudentId } from 'apis/student.api'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
const LIMIT = 10
export default function StudentsPage() {
  // const [students, setStudents] = useState<Students>([])
  // const [isLoading, setIsLoading] = useState<Boolean>(false)
  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudent(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //     .finally(() => setIsLoading(false))
  // }, [])
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const queryClient = useQueryClient()

  const studentQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => {
      const controller = new AbortController()
      const signal = controller.signal

      setTimeout(() => {
        controller.abort()
      }, 3000)
      return getStudent(page, LIMIT, signal)
    },
    keepPreviousData: true,
    retry: 0
  })

  const totalStudent = Number(studentQuery.data?.headers['x-total-count']) || 0
  const totalPage = Math.ceil(totalStudent / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => {
      return deleteStudent(`${id}`)
    },
    onSuccess: (_, id) => {
      alert(`Delete profile successfully with id ${id}`)
      queryClient.invalidateQueries({
        queryKey: ['students', page],
        exact: true
      })
    }
  })

  const handleDelete = (id: number) => {
    return deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    // queryClient.prefetchQuery(['student', String(id)], {
    //   queryFn: () => getStudentId(id),
    //   staleTime: 10 * 1000
    // })
  }

  const fetchStudent = (second: number) => {
    const id = '6'
    queryClient.prefetchQuery(['student', id], {
      queryFn: () => getStudentId(id),
      staleTime: second * 1000
    })
  }

  const refetchStudents = () => {
    studentQuery.refetch()
  }

  const cancelRequestStudents = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
  }
  return (
    <div>
      <h1 className='mb-4 text-lg '>Students</h1>
      <div>
        <button className='mb-5 rounded bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(10)}>
          Click 10s
        </button>
      </div>
      <div>
        <button className='mb-5 rounded bg-blue-500 px-5 py-2 text-white' onClick={() => fetchStudent(2)}>
          Click 2s
        </button>
      </div>
      <div>
        <button className='mb-5 rounded bg-pink-500 px-5 py-2 text-white' onClick={refetchStudents}>
          Refetch Students
        </button>
      </div>
      <div>
        <button className='mb-5 rounded bg-red-500 px-5 py-2 text-white' onClick={cancelRequestStudents}>
          Cancel Request Students
        </button>
      </div>

      <Link
        to='/students/add'
        className='rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-100'
      >
        Add Student
      </Link>
      {studentQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700  dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentQuery.data?.data.map((student) => (
                  <tr
                    onMouseEnter={() => handlePrefetchStudent(student.id)}
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700  dark:hover:bg-gray-600'
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th
                      scope='row'
                      className='whitespace-nowrap  py-4 px-6 font-medium text-gray-900 dark:text-gray-700'
                    >
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Previous
                    </span>
                  ) : (
                    <Link
                      to={`/students?page=${page - 1}`}
                      className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300 py-2 px-3 leading-tight  hover:bg-gray-100 hover:text-gray-700',
                            {
                              'bg-gray-300 text-gray-700': isActive,
                              'bg-white text-gray-500': !isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}
                {page !== totalPage ? (
                  <li>
                    <Link
                      to={`/students?page=${page + 1}`}
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Next
                    </Link>
                  </li>
                ) : (
                  <li>
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700   dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
