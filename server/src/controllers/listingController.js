import { Listing } from '../models/Listing.js';
import Joi from 'joi';

// 1. Validation Schema
// We define what data is allowed when creating or updating a listing
const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(), // Ensures price is non-negative
  category: Joi.string().valid('textbooks', 'electronics', 'furniture', 'clothing', 'other'),
  condition: Joi.string().valid('new', 'like-new', 'used', 'worn'),
  status: Joi.string().valid('active', 'sold', 'removed'),
  seller: Joi.string() // Expecting an ObjectId string
});

const updateListingSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0),
  category: Joi.string().valid('textbooks', 'electronics', 'furniture', 'clothing', 'other'),
  condition: Joi.string().valid('new', 'like-new', 'used', 'worn'),
  status: Joi.string().valid('active', 'sold', 'removed'),
  seller: Joi.string()
});

// 2. GET /api/listings
export async function getAllListings(req, res, next) {
  try {
    // If the user adds ?includeRemoved=true in the URL, we show everything.
    // Otherwise, we filter out anything where status is 'removed'.
    const filter = req.query.includeRemoved === 'true' ? {} : { status: { $ne: 'removed' } };
    
    // Stretch Goal: .populate('seller') replaces the seller ID with their actual name and email!
    const listings = await Listing.find(filter).populate('seller', 'name email');
    res.json(listings);
  } catch (err) { next(err); }
}

// 3. GET /api/listings/:id
export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email');
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Don't silently show removed listings here either!
    if (listing.status === 'removed' && req.query.includeRemoved !== 'true') {
       return res.status(404).json({ error: 'Listing has been removed' });
    }

    res.json(listing);
  } catch (err) { next(err); }
}

// 4. POST /api/listings
export async function createListing(req, res, next) {
  try {
    // Validate the incoming data against our Joi schema
    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // If valid, save it to MongoDB
    const newListing = await Listing.create(value);
    res.status(201).json(newListing);
  } catch (err) { next(err); }
}

// 5. PATCH /api/listings/:id
export async function updateListing(req, res, next) {
  try {
    const { error, value } = updateListingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // { new: true } tells Mongoose to return the updated document, not the old one
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    
    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(updatedListing);
  } catch (err) { next(err); }
}

// 6. DELETE /api/listings/:id
// This is the "Soft Delete" requested in the instructions
export async function deleteListing(req, res, next) {
  try {
    // We intentionally DO NOT use findByIdAndDelete.
    // Instead, we just update the status to 'removed'.
    const deletedListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { status: 'removed' }, 
      { new: true }
    );
    
    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({ message: 'Listing successfully removed', listing: deletedListing });
  } catch (err) { next(err); }
}

// 7. PATCH /api/listings/:id/sold
// Stretch Goal: Mark as sold instantly without needing full validation
export async function markAsSold(req, res, next) {
  try {
    const soldListing = await Listing.findByIdAndUpdate(
      req.params.id, 
      { status: 'sold' }, 
      { new: true }
    );
    
    if (!soldListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({ message: 'Listing marked as sold!', listing: soldListing });
  } catch (err) { next(err); }
}
