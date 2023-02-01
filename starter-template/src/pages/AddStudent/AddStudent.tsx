import { useMatch } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudentId, updateStudent } from 'apis/student.api'
import { Student } from 'types/student.type'
import { useEffect, useMemo, useState } from 'react'
import { axiosError } from 'utils/utils'
import { useParams } from 'react-router-dom'

type FormStateType = Omit<Student, 'id'>

const initialFormState: FormStateType = {
  avatar: '',
  btc_address: '',
  country: '',
  email: '',
  first_name: '',
  gender: 'other',
  last_name: ''
}

type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null
export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState)
  const addMatch = useMatch('/students/add')
  const isAddMode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()

  const studentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentId(id as string),
    enabled: id !== undefined,
    // onSuccess: (data) => {
    //   setFormState(data.data)
    // },
    staleTime: 10 * 1000
  })

  useEffect(() => {
    if (studentQuery.data) {
      setFormState(studentQuery.data.data)
    }
  }, [])
  const updateStudentMutation = useMutation({
    mutationFn: (_) => {
      return updateStudent(id as string, formState as Student)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['student', id], data)
    }
  })
  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    }
  })
  const errorForm: FormError = useMemo(() => {
    const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error
    if (axiosError<{ error: FormError }>(error) && error.response?.status === 422) {
      return error.response?.data.error
    }
    return null
  }, [addStudentMutation.error, isAddMode, updateStudentMutation.error])

  const handleEvent = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (addStudentMutation.data || addStudentMutation.error) {
      addStudentMutation.reset()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddMode) {
    } else {
      updateStudentMutation.mutate(undefined, {
        onSuccess(_) {
          alert('Update profile successfully')
        }
      })
    }
    addStudentMutation.mutate(formState, {
      onSuccess: () => {
        setFormState(initialFormState)
      }
    })
  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Student</h1>
      {updateStudentMutation.isLoading ? (
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
      ) : (
        <form className='mt-6' onSubmit={handleSubmit}>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='floating_email'
              id='floating_email'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              value={formState.email}
              onChange={handleEvent('email')}
              required
            />
            <label
              htmlFor='floating_email'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Email address
            </label>
            {errorForm && (
              <p className='mt-2 block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500'>
                <span className='font-medium'>Lôĩ! {errorForm.email}</span>
              </p>
            )}
          </div>

          <div className='group relative z-0 mb-6 w-full'>
            <div>
              <div>
                <div className='mb-4 flex items-center'>
                  <input
                    id='gender-1'
                    type='radio'
                    name='gender'
                    value='Male'
                    checked={formState.gender === 'Male'}
                    onChange={handleEvent('gender')}
                    className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  />
                  <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Male
                  </label>
                </div>
                <div className='mb-4 flex items-center'>
                  <input
                    defaultChecked
                    id='gender-2'
                    type='radio'
                    name='gender'
                    value='Female'
                    checked={formState.gender === 'Female'}
                    onChange={handleEvent('gender')}
                    className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  />
                  <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Female
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    defaultChecked
                    id='gender-3'
                    type='radio'
                    value='Agender'
                    onChange={handleEvent('gender')}
                    checked={formState.gender === 'Agender'}
                    name='gender'
                    className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                  />
                  <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='country'
              value={formState.country}
              onChange={handleEvent('country')}
              id='country'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='country'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Country
            </label>
          </div>
          <div className='grid md:grid-cols-2 md:gap-6'>
            <div className='group relative z-0 mb-6 w-full'>
              <input
                type='tel'
                name='first_name'
                value={formState.first_name}
                id='first_name'
                onChange={handleEvent('first_name')}
                className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
                placeholder=' '
                required
              />
              <label
                htmlFor='first_name'
                className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
              >
                First Name
              </label>
            </div>
            <div className='group relative z-0 mb-6 w-full'>
              <input
                type='text'
                name='last_name'
                value={formState.last_name}
                onChange={handleEvent('last_name')}
                id='last_name'
                className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
                placeholder=' '
                required
              />
              <label
                htmlFor='last_name'
                className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
              >
                Last Name
              </label>
            </div>
          </div>
          <div className='grid md:grid-cols-2 md:gap-6'>
            <div className='group relative z-0 mb-6 w-full'>
              <input
                type='text'
                name='avatar'
                value={formState.avatar}
                onChange={handleEvent('avatar')}
                id='avatar'
                className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
                placeholder=' '
                required
              />
              <label
                htmlFor='avatar'
                className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
              >
                Avatar Base64
              </label>
            </div>
            <div className='group relative z-0 mb-6 w-full'>
              <input
                type='text'
                name='btc_address'
                id='btc_address'
                onChange={handleEvent('btc_address')}
                value={formState.btc_address}
                className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
                placeholder=' '
                required
              />
              <label
                htmlFor='btc_address'
                className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
              >
                BTC Address
              </label>
            </div>
          </div>

          <button
            type='submit'
            className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
          >
            {isAddMode ? 'Add' : 'Update'}
          </button>
        </form>
      )}
    </div>
  )
}
