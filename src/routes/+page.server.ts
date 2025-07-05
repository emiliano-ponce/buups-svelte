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

  const groupedReviews = reviews.reduce<Map<string, typeof reviews>>((acc, review) => {
    const { media } = review;
    const { title } = media;
    if (!acc.has(title)) {
      acc.set(title, []);
    }
    acc.get(title)!.push(review);
    return acc;
  }, new Map());

  // Convert to array of groups, preserving order
  const orderedGroups = Array.from(groupedReviews.entries()).map(([title, reviews]) => ({
    title,
    reviews
  }));
  
  return { reviews: orderedGroups };
}

export type PageData = Awaited<ReturnType<typeof load>>;
export type GroupedReviews = PageData['reviews'];