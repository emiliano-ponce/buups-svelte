// ReviewForm.svelte
<script lang="ts">
    import type { Media } from '$lib/server/db/schema'
    import Button from './Button.svelte'
    import ContentCard from './ContentCard.svelte'

    interface ReviewFormProps {
        media: Media
        user: { id: number; username: string }
    }

    const { media, user }: ReviewFormProps = $props()
</script>

<div class="form-wrapper">
    <ContentCard variant="sides">
        <img src={media.imageUrl} alt={media.title} />
    </ContentCard>
    <form method="POST">
        <input type="hidden" name="mediaId" value={media.id} />
        <input type="hidden" name="authorId" value={user.id} />
        
        <div>
            <label for="score">Score</label>
            <input 
                type="number" 
                id="score" 
                name="score" 
                min="1"
                max="999"
                required
            />
        </div>

        <div>
            <label for="body">Review</label>
            <textarea 
                id="body" 
                name="body" 
                rows="6" 
                required
            ></textarea>
        </div>

        <Button type="submit">Submit Review</Button>
    </form>
</div>

<style>
    .form-wrapper {
        max-width: 1000px;
        width: 100%;
    }
</style>