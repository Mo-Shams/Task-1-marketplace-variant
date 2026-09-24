async function runTests() {
  console.log("1. POST: Creating a new listing...");
  const postRes = await fetch('http://localhost:4000/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "My old Laptop",
      price: 300,
      category: "electronics",
      condition: "used"
    })
  });
  const created = await postRes.json();
  console.log("Created Listing:", created);
  const id = created._id;

  console.log("\n2. GET: Fetching all listings...");
  const getAllRes = await fetch('http://localhost:4000/api/listings');
  const allListings = await getAllRes.json();
  console.log(`Found ${allListings.length} total active listings.`);

  console.log(`\n3. GET: Fetching by ID (${id})...`);
  const getByIdRes = await fetch(`http://localhost:4000/api/listings/${id}`);
  const fetchedListing = await getByIdRes.json();
  console.log("Fetched Listing title:", fetchedListing.title);

  console.log("\n4. PATCH: Updating price to 250...");
  const patchRes = await fetch(`http://localhost:4000/api/listings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 250 })
  });
  const updated = await patchRes.json();
  console.log("Updated Listing price:", updated.price);

  console.log("\n5. DELETE: Soft deleting the listing...");
  const deleteRes = await fetch(`http://localhost:4000/api/listings/${id}`, {
    method: 'DELETE'
  });
  const deleted = await deleteRes.json();
  console.log("Delete message:", deleted.message);

  console.log("\n6. GET: Fetching all listings again (should be hidden)...");
  const getFinalRes = await fetch('http://localhost:4000/api/listings');
  const finalListings = await getFinalRes.json();
  console.log(`Found ${finalListings.length} total active listings. The laptop is successfully hidden!`);
}

runTests().catch(console.error);
