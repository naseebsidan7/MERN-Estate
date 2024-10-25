import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import  SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import ListingCard from '../components/ListingCard'

const Home = () => {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation])

  useEffect(() => {
       const fetchOfferListings = async () => {
          try {
            const res = await fetch('/api/listing/get?offer=true&limit=4&sort=created')
            const data = await res.json()
            setOfferListings(data)
            fetchRentListings()

          } catch (error) {
             console.log(error)
          }
       }

       const fetchRentListings = async () => {
         try {
            const res = await fetch('/api/listing/get?type=rent&limit=4')
            const data = await res.json()
            setRentListings(data)
            fetchSaleListings()
         }
         catch (error) {
             console.log(error)
         }
       }

       const fetchSaleListings = async () => {
        try {
           const res = await fetch('/api/listing/get?type=sale&limit=4')
           const data = await res.json()
           setSaleListings(data)
        }
        catch (error) {
            console.log(error)
        }
      }

       fetchOfferListings()
  }, [])

  return (
    <div>
      {/* TOP*/}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
         <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span> 
         <br/>place with ease</h1>
         <div className='text-gray-400 text-xs sm:text-sm'>
             Sidan Estate is the best place to find your next perfect place to live.
             <br />
             We have a wide range of properties for you to choose from.
         </div>
         <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline w-[130px]' to={'/search'}>
              Lets get started..
         </Link>
      </div>

      {/* SWIPER */}
      <Swiper navigation>

 
      {offerListings && offerListings.length > 0 && 
               offerListings.map((listing, index) => (
                    <SwiperSlide key={index}>
                         <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} className='h-[600px]' key={listing._id}>

                         </div>
                    </SwiperSlide>
               ))
       }
       </Swiper>

      {/* LISTING RESULTS FOR OFFER, SALES AND RENT */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
         {offerListings && offerListings.length > 0 && (
          <div className=''>
           
             <div className='my-3'>
                <h2 className='text-2xl text-slate-600 font-semibold  inline-flex flex-col gap-1'>
                   Recent Offers
                   <Link className='text-sm   text-blue-800 hover:underline' to={'/search?offer=true'}>
                     Show more offers
                   </Link>
                </h2>
             </div>

             <div className='flex flex-wrap gap-4'>
                 { 
                  offerListings.map((listing) => (
                          <ListingCard key={listing._id} listing={listing} />
                  ))
                 }
             </div>

          </div>
         )}

         {rentListings && rentListings.length > 0 && (
          <div className=''>
           
             <div className='my-3'>
                <h2 className='text-2xl text-slate-600 font-semibold  inline-flex flex-col gap-1 '>
                   Recent place for rent
                   <Link className='text-sm  text-blue-800 hover:underline' to={'/search?type=rent'}>
                     Show more place for rent
                   </Link>
                </h2>
             </div>

             <div className='flex flex-wrap gap-4'>
                 { 
                  rentListings.map((listing) => (
                          <ListingCard key={listing._id} listing={listing} />
                  ))
                 }
             </div>

          </div>
         )}

         {saleListings && saleListings.length > 0 && (
          <div className=''>
           
             <div className='my-3'>
                <h2 className='text-2xl text-slate-600 font-semibold  inline-flex  flex-col gap-1'>
                   Recent sales 
                   <Link className='text-sm  text-blue-800 hover:underline' to={'/search?offer=true'}>
                     Show more places for sales
                   </Link>
                </h2>
             </div>

             <div className='flex flex-wrap gap-4'>
                 { 
                  saleListings.map((listing) => (
                          <ListingCard key={listing._id} listing={listing} />
                  ))
                 }
             </div>

          </div>
         )}
      </div>
    </div>
  )
}

export default Home