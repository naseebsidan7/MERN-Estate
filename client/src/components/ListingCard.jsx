import {Link} from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

const ListingCard = ({listing}) => {
   
  return (
    <div className='overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow
                    rounded-lg w-full sm:w-[300px]'>
        <Link to={`/listing/${listing._id}`}>
              <img className=' h-[320px] sm:h-[220px] w-full sm:w-[300px] object-cover
                               hover:scale-105 transition-scale duration-300' 
                   src={listing.imageUrls[0] || 'https://img.freepik.com/free-psd/3d-house-property-illustration_23-2151682308.jpg?t=st=1729859435~exp=1729863035~hmac=651e533a73498c030119ae7df2db80f0c89561efc36f59eaa010afa1efa43450&w=1380'} alt="listing cover" />

              
              <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className=' text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>

                    <div className='flex items-center gap-1 '>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className=' text-sm w-full text-gray-600 truncate'>{listing.address}</p>
                    </div>
                         
                    <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                    <p className='text-slate-500 mt-2 font-semibold flex items-center gap-1'>${' '} {listing.offer ? listing.discountPrice.toLocaleString('en-US') :
                                listing.regularPrice.toLocaleString('en-US') }
                        <div>  {listing.type === 'rent' && '/ month'}</div>
                    </p>

                    <div className='text-slate-700 flex gap-4 '>
                         <div className='font-bold text-xs'>
                             {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed` }
                         </div>
                         <div className='font-bold text-xs'>
                             {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath` }
                         </div>
                    </div>
               
              </div>
        </Link>
    </div>
  )
}

export default ListingCard