<script lang="ts">
	import { swap } from '#lib/swap.js';

	let text = $state('');
</script>

<svelte:head>
	<title>tint</title>
</svelte:head>

<div class="mx-auto flex h-dvh max-w-2xl flex-col px-4 py-8">
	<textarea
		bind:value={text}
		placeholder="paste text"
		aria-label="text"
		class="h-full w-full resize-none border-0 bg-transparent text-lg outline-none focus:ring-0"
	></textarea>
</div>

<button
	type="button"
	disabled={!text}
	onclick={() => (text = swap(text))}
	class="fixed right-4 bottom-4 rounded-full bg-black px-5 py-2 text-white disabled:opacity-40"
>
	swap
</button>
