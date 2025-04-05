import type { Review } from "$lib/server/db/schema";

const testReview: Review = {
    id: "test",
    title: "Test review",
    authorId: "testUser",
    body: "What an amazing review!",
    mediaId: "testMedia",
    score: 7,
    createDt: new Date('2023-01-01T00:00:00.000Z')
}

const testReviews: Review[] = [
    testReview,
    {
        id: "test2",
        title: "Test review 2",
        authorId: "testUser",
        body: "What an amazing review 2!",
        mediaId: "testMedia",
        score: 7,
        createDt: new Date()
    },
    {
        id: "test3",
        title: "Test review 3",
        authorId: "testUser",
        body: "What an amazing review 3!",
        mediaId: "testMedia",
        score: 7,
        createDt: new Date()
    },
]