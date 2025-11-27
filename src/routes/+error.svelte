<script>
    import { page } from '$app/stores'
</script>

<div class="error-page">
    <h1>{$page.status}</h1>
    <p>{$page.error?.message || 'Page not found'}</p>
    <a href="/">Return Home</a>
</div>