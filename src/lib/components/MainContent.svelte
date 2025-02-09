<script>
  import FramePart from './FramePart.svelte';
  
  let { children } = $props();
  
</script>

<div class="flex h-full w-full">
  <div id="MainFrameLeft" class="flex flex-col gap-0.5">
    <FramePart corner="top-left" variant="column" className="bg-red" size="sm"></FramePart>
    <FramePart variant="column" className="bg-red"></FramePart>
    <FramePart variant="column" className="bg-tan" size="sm"></FramePart>
    <FramePart variant="column" className="bg-blue" size="flex"></FramePart>
    <FramePart variant="column" className="bg-purple" size="lg"></FramePart>
    <FramePart variant="column" className="bg-red" size="md"></FramePart>
  </div>
  <div class="flex flex-1 flex-col">
    <div id="MainFrameTop" class="flex gap-0.5">
      <FramePart variant="row" className="bg-red" size="lg"></FramePart>
      <FramePart variant="row" className="bg-tan" size="sm"></FramePart>
      <FramePart variant="row" className="bg-red" size="md" thickness={1}></FramePart>
      <FramePart variant="row" className="bg-purple" size="flex"></FramePart>
      <FramePart variant="row" className="bg-blue" size="sm"></FramePart>
    </div>
    <div id="ContentWrap" class="bg-red flex-1">
      <main class="min-h[200px] min-w[200] bg-background h-full overflow-auto p-2">
        {@render children()}
      </main>
    </div>
  </div>
</div>

<style>
  main {
    border-top-left-radius: 60px;
  }
</style>
