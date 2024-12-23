 
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react"
import { app } from "../firebase";
import {useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateListing = () => {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    })

    const {currentUser} = useSelector((state) => state.user)
    const navigate = useNavigate()
    const params = useParams()
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
       const fetchListing = async () =>{
           const listingId = params.listingId;
           const res = await fetch(`/api/listing/get/${listingId}`)
           const data = await res.json()
    
           if(data.success === false){
                console.log(data.message)
                return
           }
           setFormData(data)
       }
       fetchListing()
    },[])

    const handleImageSubmit = () => {
        if( files.length > 0 && files.length + formData.imageUrls.length < 7 ){
            setUploading(true);
            setImageUploadError(false)
            const promises = [];

            for (let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]))
            }
  
            
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false);

            }).catch((err)=>{
                setImageUploadError('Image upload failed (2 mb max per image ) ')
                setUploading(false);
            })
          
        }else{
            setImageUploadError('You can only upload 6 images per listing ')
            setUploading(false);
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                      const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100 ;
                      console.log(progress,'% done')
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) =>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
        })
    }

    const handleChange = (e) => {
         if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            })
         }

         if(e.target.id === 'parking' || e.target.id === 'furnished' ){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            
            })
         }

         if(e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
                discountPrice: 0
            })
         }

         if(e.target.type === 'number' || e.target.type === 'text' ||  e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id] :  e.target.value
            })
         }
         
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            if(formData.imageUrls.length < 1 ) return setError('You must upload 1 image')
            if(+formData.regularPrice < +formData.discountPrice ) return setError('Discount Price must be lower than regular price ')
            setError(false)
            setLoading(true);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef : currentUser._id
                })
            });

            const data = await res.json()
            setLoading(false);
            if(data.success === false){
                setError(data.message)
                setLoading(false);
            }

            navigate(`/listing/${data._id}`)

        } catch (error) {
            console.log(error);
            setError(error.message)
        }
    }

  return (
    <main className="p-3 max-w-4xl  mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Update Listing </h1>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
             
             <div className="flex flex-col gap-4 flex-1 ">
                <input onChange={handleChange} value={formData.name} type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength='62' minLength='10' required />
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required />
                <input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required />

                <div className="flex gap-6 flex-wrap">
                    <div className=" flex gap-2">
                        <input type="checkbox" onChange={handleChange} checked={formData.type === 'sale'}
                               id="sale" className="w-5"  />
                        <span>Sell</span>
                    </div>
                    <div className=" flex gap-2">
                     <input type="checkbox" id="rent" onChange={handleChange} checked={formData.type === 'rent'} className="w-5"  />
                     <span>Rent</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id="parking"  onChange={handleChange} checked={formData.parking} className="w-5"  />
                        <span>Parking spot</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id="furnished" onChange={handleChange} checked={formData.furnished} className="w-5"  />
                        <span>Furnished</span>
                    </div>
                    <div className=" flex gap-2">
                        <input type="checkbox" id="offer"  onChange={handleChange} checked={formData.offer} className="w-5"  />
                        <span>Offer</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  
                     <div className=" flex items-center gap-2">
                          <input onChange={handleChange} value={formData.bedrooms} className="p-3 border border-gray-300 rounded-lg" 
                          type="number" id="bedrooms" min='1' max='10' required/>
                          <p>Beds</p>
                     </div>

                     <div className=" flex items-center gap-2">
                          <input onChange={handleChange} value={formData.bathrooms} className="p-3 border border-gray-300 rounded-lg"
                          type="number" id="bathrooms" min='1' max='10' required/>
                          <p>Baths</p>
                     </div>

                     <div className=" flex items-center gap-2">
                          <input onChange={handleChange} value={formData.regularPrice} className="p-3 border border-gray-300 rounded-lg" 
                          type="number" id="regularPrice" min='50' max='1000000' required/>
                          
                          <div className="flex flex-col items-center">
                             <p>Regular Price</p>
                             <span className="text-xs">($ / month )</span>
                          </div>
                     </div>

                    {formData.offer && (
                        <div className=" flex items-center gap-2">
                          <input onChange={handleChange} value={formData.discountPrice} className="p-3 border border-gray-300 rounded-lg" 
                          type="number" id="discountPrice" min='0' max='100000' required/>
                         
                          <div className="flex flex-col items-center">
                             <p>Discounted Price</p>
                             <span className="text-xs">($ / month )</span>
                          </div>
                     </div>
                    )}

                </div>
             </div>


             <div className="flex flex-col flex-1 gap-4 mt-5 sm:mt-0">
                  <p className="font-semibold">Images: 
                       <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span> 
                  </p>

                 <div className=" flex gap-4">
                    <input  className=" border rounded w-full border-gray-300 p-3"
                    type="file" onChange={(e) => setFiles(e.target.files)} id="images" accept="image/*" multiple />
                    <button disabled={uploading} type="button" onClick={handleImageSubmit} className=" p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                 </div>
                 <p className="text-red-700 text-sm">{imageUploadError && imageUploadError }</p>
                 {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=> (
                        <div key={url} className="flex justify-between p-3 border items-center ">
                           <img src={url} alt="listing image" className="rounded-lg w-20 h-20 object-contain" />
                           <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 uppercase rounded-lg hover:opacity-70 ">Delete</button>
                        </div>
                    ))
                 }
                 <button disabled={loading || uploading} className="bg-slate-700 mt-3 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading? 'Updating': 'Update Listing'}</button>
                 {error && <p className="text-red-700 text-sm">{error}</p>}
             </div>
            
        </form>
    </main>
  )
}

export default UpdateListing