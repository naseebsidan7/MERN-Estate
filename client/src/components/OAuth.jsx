import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleAuth = async () => {
         try {
             const provider = new GoogleAuthProvider()
             const auth = getAuth(app)

             const result = await signInWithPopup(auth, provider)
             console.log(result)
             const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name:  result.user.displayName,
                    email: result.user.email, 
                    photo: result.user.photoURL
                 })
             })
             const data = await res.json()
             dispatch(signInSuccess(data))
             navigate('/')
             
         }catch (err) {
            console.log('could not sign in with google : ',err)
         }
    }

  return (
    <button onClick={handleGoogleAuth} type="button" className="bg-red-700 p-3 text-white rounded-lg uppercase hover:opacity-95">Continue with Google</button>
  )
}

export default OAuth