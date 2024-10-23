import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = ({listing}) => {
    const [ landLord, setLandLord ] = useState(null)
    const [ error, setError ] = useState(false)
    const [ message, setMessage ] = useState('')

    useEffect(()=> {
         const fetchLandLord = async () => {
            try {
                setError(false)
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandLord(data)
            } catch (error) {
                console.log(error)
                setError(true)
            }
         }
         fetchLandLord()

    },[listing?.userRef])

    const onChange = (e) => {
        setMessage(e.target.value)
    }
    console.log(message)
  return (
    <> 
         <p>{error && error}</p>
         {landLord && (
              <div className='flex flex-col gap-2'>
                <p>Contact <span className='font-semibold'>{landLord?.username}</span>
                    {' '} for   {' '} 
                    <span className='font-semibold' >{listing.name.toLowerCase()}</span>
                </p>
                <textarea className='w-full border p-3 rounded-lg mt-3' placeholder='Enter your message'
                          onChange={onChange} value={message} name="message" id="message" rows='2'></textarea>
                <Link
                    className='bg-slate-700 text-white text-center p-3 rounded-lg hover:opacity-95'
                    to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Send Message
                    </Link>

              </div>
         )}
    </>
  )
}

export default Contact