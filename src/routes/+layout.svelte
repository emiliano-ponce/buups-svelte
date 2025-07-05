<script lang="ts">
  import MainContent from '$lib/components/MainContent.svelte'
  import MainNavigation from '$lib/components/MainNavigation.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import '../app.css'

  let { children } = $props();
</script>

<div class="flex">
	<div class="sidebar-wrapper">
		<Sidebar/>
	</div>
	<div class="flex flex-col gap-1">
		<MainNavigation />
		<MainContent>
			{@render children()}
		</MainContent>
	</div>
</div>

<style>
</style>