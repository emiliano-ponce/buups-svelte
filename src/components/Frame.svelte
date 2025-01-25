<script lang="ts">
    interface FrameProps {
        position: 'top' | 'bottom' | 'left' | 'right' | 'corner';
        color: 'red' | 'purple' | 'blue' | 'brown'
    }

    export let position: FrameProps['position'] = 'top';
    export let color: FrameProps['color'] = 'red';
</script>

<style>
    .frame {
        width: 100%;
    }
</style>

<div class="frame {position}" style:--background-color="{color}">
    <slot />
</div>