import { db } from "$lib/server/db";

// function load() -- runs on server -- load data and read/write cookies for this page
export async function load() {
  const reviews = await db.query.review.findMany({
    with: {
      author: true,
      media: true
    },
    orderBy: (reviews, { desc }) => [desc(reviews.createDt)]
  });
  
  return { reviews }
}