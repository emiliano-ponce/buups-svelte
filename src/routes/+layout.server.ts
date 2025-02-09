import { db } from '$lib/server/db';

// -- https://svelte.dev/docs/kit/load#Layout-data --
// load data and read/write cookies for all pages under this layout
export async function load() {
  const reviews = await db.query.review.findMany({
    with: {
      author: true,
      media: true
    },
    orderBy: (reviews, { desc }) => [desc(reviews.createDt)]
  });
}
