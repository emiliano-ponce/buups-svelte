<script lang="ts">
  import MainContent from '$lib/components/MainContent.svelte'
  import MainNavigation from '$lib/components/MainNavigation.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import '../app.css'

  let { children } = $props();
</script>

<div class="app-wrapper">
	<div class="sidebar-wrapper">
		<Sidebar/>
	</div>
	<div class="main-wrapper">
		<MainNavigation />
		<MainContent>
			{@render children()}
		</MainContent>
	</div>
</div>

<style>
  .app-wrapper {
    display: flex;
    height: 100vh;
  }
  .main-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>