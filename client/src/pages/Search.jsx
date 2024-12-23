import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingCard from '../components/ListingCard'

const Search = () => {
     const navigate = useNavigate()
     const [sidebarData, setSidebarData] = useState({
            searchTerm: '',
            type: 'all',
            parking: false,
            furnished: false,
            offer: false,
            sort: 'created_at',
            order: 'desc'
     })

     const [loading, setLoading] = useState(false)
     const [listings, setListings] = useState([])
     const [showMore, setShowMore] = useState(false)

     const handleChange = (e) => {
          if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' ){
               setSidebarData({...sidebarData, type: e.target.id })
          }

          if(e.target.id === 'searchTerm'){
               setSidebarData({...sidebarData, searchTerm: e.target.value })
          }

          if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer' ){
               setSidebarData({...sidebarData, [e.target.id]:  e.target.checked || e.target.checked === 'true' ? true : false})
          }

          if(e.target.id === 'sort_order'){
               const sort = e.target.value.split('_')[0] || 'created_at'
               const order = e.target.value.split('_')[1] || 'desc'
               setSidebarData({...sidebarData, sort, order })
          }
       
     }

     const handleSubmit = (e) => {
          e.preventDefault()

          const urlParams = new URLSearchParams()
          urlParams.set('searchTerm', sidebarData.searchTerm)
          urlParams.set('type', sidebarData.type)
          urlParams.set('parking', sidebarData.parking)
          urlParams.set('furnished', sidebarData.furnished)
          urlParams.set('offer', sidebarData.offer)
          urlParams.set('sort', sidebarData.sort)
          urlParams.set('order', sidebarData.order)

          const searchQuery = urlParams.toString()
          navigate(`/search?${searchQuery}`)
     }

     useEffect(() => {
         const urlParams = new URLSearchParams(location.search);
        
         const searchTermFromUrl = urlParams.get('searchTerm')
         const typeFromUrl = urlParams.get('type')
         const parkingFromUrl = urlParams.get('parking')
         const furnishedFromUrl = urlParams.get('furnished')
         const offerFromUrl = urlParams.get('offer')
         const sortFromUrl = urlParams.get('sort')
         const orderFromUrl = urlParams.get('order')
 
         if(searchTermFromUrl || 
            typeFromUrl || 
            parkingFromUrl || 
            furnishedFromUrl || 
            offerFromUrl || 
            sortFromUrl || 
            orderFromUrl )
          {
             setSidebarData({ 
                    searchTerm: searchTermFromUrl||'',
                    type: typeFromUrl ||  'all',
                    parking: parkingFromUrl === 'true'? true :  false,
                    furnished: furnishedFromUrl === 'true'? true :  false,
                    offer: offerFromUrl === 'true'? true :  false,
                    sort: sortFromUrl ||  'created_at',
                    order: orderFromUrl || 'desc'
              })
         }

         const fetchListing = async () => {
          setLoading(true)
          setShowMore(false)
          const searchQuery = urlParams.toString()
          
          const res = await fetch(`/api/listing/get?${searchQuery}`);
          const data = await res.json()
          if(data.length > 8){
               setShowMore(true)
          }else{
               setShowMore(false)
          }
          setLoading(false)
          setListings(data)
         } 

          fetchListing();
     }, [location.search])
  
  const onShowMoreClick = async () => {
       const numberofListings = listings.length;
       const startIndex = numberofListings ;
       const urlParams = new URLSearchParams(location.search)
       urlParams.set('startIndex', startIndex)
      
       const searchQuery = urlParams.toString()
       const res = await fetch(`/api/listing/get?${searchQuery}`);
       const data = await res.json()
    
       if(data.length < 9 ){
            setShowMore(false)
       }
       setListings([...listings, ...data])
  }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2  md:min-h-screen '>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8' >
                
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold '> Search Term:</label>
                    <input type="text" id='searchTerm' placeholder='Search..'
                           onChange={handleChange} value={sidebarData.searchTerm}   className='border p-3 w-full rounded-lg' />
                </div>

                <div className='flex gap-2 items-center flex-wrap'>
                     <label className='font-semibold ' >Type:</label>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.type === 'all'} className='w-5' id='all' />
                          <span>Rent & Sale</span>
                     </div>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.type === 'rent'}   className='w-5' id='rent' />
                          <span>Rent</span>
                     </div>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.type === 'sale'} className='w-5' id='sale' />
                          <span>Sale</span>
                     </div>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.offer} className='w-5' id='offer' />
                          <span>Offer</span>
                     </div>
                </div>

                <div className='flex gap-2 items-center flex-wrap'>
                     <label className='font-semibold '>Amenities:</label>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.parking}  className='w-5' id='parking' />
                          <span>Parking</span>
                     </div>
                     <div className='flex gap-2'>
                          <input type="checkbox"  onChange={handleChange} checked={sidebarData.furnished}  className='w-5' id='furnished' />
                          <span>Furnished</span>
                     </div>
                </div>

                <div className='flex items-center gap-2'>
                      <label className='font-semibold ' >Sort: </label>
                      <select defaultValue={'created_at_desc'} 
                              onChange={handleChange}
                              id="sort_order" className='border rounded-lg p-3 bg-white'>
                          <option value='regularPrice_desc' > Price high to low </option>
                          <option value='regularPrice_asc' > Price low to high </option>
                          <option value='createdAt_desc' > Latest </option>
                          <option value='createdAt_asc' > Oldest </option>
                      </select>
                </div>

                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 '>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>

            <div className=' p-7 flex flex-wrap gap-4'>
                 {!loading && listings.length === 0 && (
                      <p className='text-xl text-red-500  '>No listing found!</p>
                 )}
                 {loading && (
                     <div className='flex justify-center w-full my-10'>
                       <div className="loader"></div>  
                     </div>
                 )}


                 {!loading && listings && listings.map((listing) =>(
                         <ListingCard key={listing._id} listing={listing} />
                    ))}
            </div>

            {showMore && (
                 <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>
                    Show more
                 </button>
            )}
        </div>
    </div>
  )
}

export default Search