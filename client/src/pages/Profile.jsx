import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [ file, setFile ] = useState(undefined)
    const [ filePerc, setFilePerc ] = useState(0)
    const [ fileUploadError, setFileUploadError ] = useState(false);
    const [ formData, setFormData ] = useState({})

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl my-7 font-semibold text-center'>Profile</h1>
     
      <form className="flex flex-col gap-4">
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
        
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg"/>
        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg"/>
        <input type="text" placeholder="password" id="password" className="border p-3 rounded-lg"/>
        
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:bg-opacity-95 disabled:opacity-80" >Update</button>
      </form>

      <div className="flex justify-between mt-5">
         <span className="text-red-700 cursor-pointer">Delete account</span>
         <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile