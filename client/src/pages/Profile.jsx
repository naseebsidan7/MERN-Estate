import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess, 
         deleteUserFailure, deleteUserStart, deleteUserSuccess,
         signOutUserFailure, signOutUserStart, signOutUserSuccess }  from '../redux/user/userSlice.js'
import { Link } from 'react-router-dom'


const Profile = () => {
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [ file, setFile ] = useState(undefined)
    const [ filePerc, setFilePerc ] = useState(0)
    const [ fileUploadError, setFileUploadError ] = useState(false);
    const [ formData, setFormData ] = useState({})
    const [ updateSuccess, setUpdateSuccess ] = useState(false)
    const [ showListingError, setShowListingError] = useState(false)
    const [ showListingLoading, setShowListingLoading] = useState(false)
    const [ userListings, setUserListings ] = useState([])

    const dispatch = useDispatch()

    useEffect(()=>{
       if(file){
           handleFileUpload(file)
       }
    },[file])



    const handleFileUpload = (file) => {
         const storage = getStorage(app)
         const fileName = new Date().getTime() + file.name;
         const storageRef = ref(storage, fileName)
         const uploadTask = uploadBytesResumable(storageRef, file)
        
        uploadTask.on('state_changed',
         
          (snapshot) => {
               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setFilePerc(Math.round(progress))
          },

          (error) => {
            setFileUploadError(error)
            console.log(error)
          },

          () =>{
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                 setFormData({...formData, avatar: downloadURL })

              })
          }
       );

    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           dispatch(updateUserStart())

         const res = await fetch(`/api/user/update/${currentUser._id}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',

            },
            body: JSON.stringify(formData)
         })

         const data = await res.json()
         if(data.success == false){
             dispatch(updateUserFailure(data.message))
             return
         }
         dispatch(updateUserSuccess(data))
         setUpdateSuccess(true)

        } catch (error) {
           dispatch(updateUserFailure(error.message))
        }
    }

    const handleDeleteUser = async () =>{
        try {
          dispatch(deleteUserStart())
          const res = await fetch(`/api/user/delete/${currentUser._id}`,{
               method: 'DELETE'
          });

          const data = await res.json()
          if(data.success === false){
                dispatch(deleteUserFailure(data.message))
          }

          dispatch(deleteUserSuccess(data))

        } catch (error) {
          console.log(error)
          dispatch(deleteUserFailure(error))
        }
    }

    const handleSignOut = async () =>{
       try {
          dispatch(signOutUserStart())
          const res = await fetch('/api/auth/signout');
          const data = res.json()
          if(data.success == false) {
              dispatch(signOutUserFailure(data.message))
              return
          }

          dispatch(signOutUserSuccess(data))
       } catch (error) {
          dispatch(signOutUserFailure(error))
       }
    }

    const handleShowListings = async() => {
        try {
          setShowListingError(false)
          setShowListingLoading(true)

          const res = await fetch(`/api/user/listings/${currentUser._id}`)
          const data = await res.json()
          if(data.success === false){
            setShowListingError(true)
            setShowListingLoading(false)
            return
          }

          setShowListingLoading(false)
          setUserListings(data)

        } catch (error) {
          setShowListingError(true)
        }
    }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl my-7 font-semibold text-center'>Profile</h1>
     
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} 
               ref={fileRef} accept="image/*" hidden />
        
        {currentUser.avatar? (
          <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center text-center mt-2' src={formData.avatar || currentUser.avatar} alt="profile" />
        ):(
          <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center text-center mt-2' src='https://i.pinimg.com/564x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg' alt="profile" />
        )}

        <p className="text-sm self-center">
           {fileUploadError?
              ( <span className="text-red-700">Error Image upload ( image must be less than 2 mb) </span>) 
                     :
              filePerc > 0 && filePerc < 100 ? 
                
                  (<span className="text-slate-700">
                      {`Uploading ${filePerc}%`}
                  </span> ) :

                  filePerc === 100 ? (
                      <span className="text-green-700">Image successfully uploaded!</span>
                    ) : ( ''
                   
                 )}</p>
        
        <input type="text"   placeholder="username" id="username" defaultValue={currentUser?.username}   onChange={handleChange} className="border p-3 rounded-lg"/>
        <input type="email"  placeholder="email"    id="email"    defaultValue={currentUser?.email}      onChange={handleChange} className="border p-3 rounded-lg"/>
        <input type="password" placeholder="password" onChange={handleChange} id="password" className="border p-3 rounded-lg"/>
        
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase text-center hover:bg-opacity-95 disabled:opacity-80" >
           {loading? 'Loading...': 'Update'}
        </button>
        <Link to={'/create-listing'}  className="bg-green-700 text-white rounded-lg p-3 text-center uppercase hover:bg-opacity-95 disabled:opacity-80" >
              Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
         <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
         <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      
        <p className="text-red-500 mt-5 text-center">  {error? error : ''} </p>
        <p className="text-green-500 mt-5 text-center "> {updateSuccess? 'User is updated successfully!' : ''} </p>

        <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
        <p className="text-red-700 mt-5">{showListingError ? 'Error showing Listings' : ''}</p>

        {showListingLoading ? 'Lading': ''}
      
        {userListings && userListings.length > 0 && 
          <div className="flex flex-col gap-4">
              <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
            
        { userListings.map((listing) => (
             <div className="border flex justify-between items-center p-3 rounded-lg gap-4" key={listing._id}>
                  <Link to={`/listing/${listing._id}`}>
                     <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain " />
                  </Link>
                  <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold hover:underline flex-1 truncate" >
                      <p >{listing.name}</p>
                  </Link>

                  <div className="flex flex-col items-center ">
                       <button className="text-red-700 uppercase">Delete</button>
                       <button className="text-green-700 uppercase">Edit</button>
                  </div>
             </div>
         ))}

         </div>
         }
    </div>
  )
}

export default Profile