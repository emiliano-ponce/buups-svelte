<script>
  import FramePart from './FramePart.svelte'
</script>

<div class="h-[300px] flex w-full">
  <div id="NavFrameLeft" class="flex flex-col gap-0.5">
    <FramePart className="column bg-purple"></FramePart>
    <FramePart corner="bottom-left" className="column bg-blue-light"></FramePart>
  </div>
  <div class="flex flex-1 flex-col">
    <div id="ContentWrap" class="bg-blue-light flex-1">
      <div class="bg-background h-full w-full p-6 nav-container">This will be navigation stuff</div> 
    </div>
    <div id="NavFrameTop" class="flex gap-0.5">
      <FramePart className="bg-blue-light" size="lg"></FramePart>
      <FramePart className="bg-orange" size="sm"></FramePart>
      <FramePart className="bg-tan" size="md" thickness={1}></FramePart>
      <FramePart className="bg-red" size="flex"></FramePart>
      <FramePart className="bg-tan" size="sm"></FramePart>
    </div>
  </div>
</div>

<style>
  .nav-container {
    border-bottom-left-radius: 60px;
  }
</style>
