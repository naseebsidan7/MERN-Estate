import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  const [ formData, setFormData ] = useState({})
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form className='flex flex-col gap-4'>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg'  />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg'  />
        <button disabled={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase opacity-90 hover:opacity-100 disabled:opacity-80 '>
             {loading? 'Loading..': 'Sign In'}
        </button>
    </form>

    <div className='flex gap-2 mt-5'>
        <p>New User? </p>
        <Link to={'/sign-in'}>
              <span className='text-blue-700'>Sign up</span>
        </Link>
    </div>
    {error && <p className='text-red-500 mt-5'>{error}</p>}
  </div>
  )
}

export default SignIn