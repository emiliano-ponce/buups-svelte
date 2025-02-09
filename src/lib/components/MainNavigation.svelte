<script>
  import FramePart from './FramePart.svelte';
</script>

<div class="h[300px] flex w-full">
  <div id="NavFrameLeft" class="flex flex-col gap-0.5">
    <FramePart variant="column" className="bg-purple"></FramePart>
    <FramePart corner="bottom-left" variant="column" className="bg-blue-light"></FramePart>
  </div>
  <div class="flex flex-1 flex-col">
    <div id="ContentWrap" class="bg-blue-light flex-1">
      <div>This will be navigation stuff</div>
    </div>
    <div id="NavFrameTop" class="flex gap-0.5">
      <FramePart variant="row" className="bg-blue-light" size="lg"></FramePart>
      <FramePart variant="row" className="bg-orange" size="sm"></FramePart>
      <FramePart variant="row" className="bg-tan" size="md" thickness={1}></FramePart>
      <FramePart variant="row" className="bg-red" size="flex"></FramePart>
      <FramePart variant="row" className="bg-tan" size="sm"></FramePart>
    </div>
  </div>
</div>

<style>
  main {
    border-top-left-radius: 60px;
  }
</style>
