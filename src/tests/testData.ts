import type { Review } from "$lib/server/db/schema";

const testReview: Review = {
    id: 1,
    authorId: "testUser",
    body: "What an amazing review!",
    mediaId: 1,
    score: 7,
    createDt: new Date('2023-01-01T00:00:00.000Z')
}

const testReviews: Review[] = [
    testReview,
    {
        id: 2,
        authorId: "testUser",
        body: "What an amazing review 2!",
        mediaId: 1,
        score: 7,
        createDt: new Date()
    },
    {
        id: 3,
        authorId: "testUser",
        body: "What an amazing review 3!",
        mediaId: 1,
        score: 7,
        createDt: new Date()
    },
]