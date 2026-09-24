import { Router } from 'express';
import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  markAsSold
} from '../controllers/listingController.js';

const router = Router();

// Retrieve all listings (GET /api/listings)
router.get('/', getAllListings);

// Create a new listing (POST /api/listings)
router.post('/', createListing);

// Retrieve a single listing by its ID (GET /api/listings/:id)
router.get('/:id', getListing);

// Update a listing (PATCH /api/listings/:id)
router.patch('/:id', updateListing);

// Soft-delete a listing (DELETE /api/listings/:id)
// Note: We use the DELETE HTTP method here because semantically the user is 
// asking to delete the item, even though our controller actually performs a soft-delete (status update).
router.delete('/:id', deleteListing);

// Stretch goal: Mark a listing as sold (PATCH /api/listings/:id/sold)
router.patch('/:id/sold', markAsSold);

export default router;
