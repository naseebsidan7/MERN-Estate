import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
   try {
     const listing = await Listing.create(req.body);
     return res.status(201).json(listing)

   } catch (error) {
     console.log(error.message)
     next(error)
   }
}

export const deleteListing = async (req, res, next) => {
  try {
    
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        return next(errorHandler(404, 'Listing not found!'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'You can only delete your own listings!'))
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json('Deleted listing successfully')

  } catch (error) {
    console.log(error.message)
    next(error)
  }
}


export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
       return next(errorHandler(404, 'Listing not found!'))
    }
    if(req.user.id !== listing.userRef){
      return next(errorHandler(404, 'You can only update your own listings!'))
   }
    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    return res.status(200).json(updatedListing)

  } catch (error) {
    console.log(error.message)
    next(error)
  }
}


export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, 'Listing not found!'))
    return res.status(201).json(listing)

  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Offer filter
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] }; // Includes both true and false if no filter is applied
    } else {
      offer = offer === 'true'; // Cast string 'true' to boolean true
    }

    // Furnished filter
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    } else {
      furnished = furnished === 'true'; // Cast string 'true' to boolean true
    }

    // Parking filter
    let parking = req.query.parking;
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    } else {
      parking = parking === 'true'; // Cast string 'true' to boolean true
    }

    // Type filter
    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] }; // Include both 'sale' and 'rent' if no filter is applied
    }

    // Search term and sorting
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1; // Set order based on query, default is 'desc'

    // Fetch listings
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings); // Use 200 for successful retrieval

  } catch (error) {
    console.log(error.message);
    next(error); // Forward error to error-handling middleware
  }
};

