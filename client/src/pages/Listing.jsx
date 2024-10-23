import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use(Navigation)
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [loadinig, setLoadinig] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        try {
            const fetchListing = async ()=> {
                setError(false)
                setLoadinig(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()
                if(data.success == false){
                    setError(true)
                    setLoadinig(false)
                    return
                }
                    
                setLoadinig(false)
                setListing(data)
            }
            fetchListing()
    
        } catch (error) {
            setError(true)
            setLoadinig(false)
        }

    },[params.listingId])

    console.log(listing,'listing')
  return (
    <main>
       { loadinig && <div className="loader_container"> <div className="loader"></div> </div>}
       { error && <p className="text-center my-7 text-2xl ">Something went wrong!</p>}

       {listing && !loadinig && !error && (
             <>
                <Swiper navigation>
                     {listing.imageUrls.map((url) => (
                         <SwiperSlide key={url}>
                               <div className="h-[500px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}>

                               </div>
                         </SwiperSlide>
                     ))}
                </Swiper>
             </>
       )

       }
    </main>
  )
}

export default Listing