<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
	let { children, data } = $props();
</script>

<div
	class="flex justify-end gap-8 border-b border-gray-300 px-20 py-4 text-lg font-medium text-gray-500"
>
	{#if data.user}
		<span>{data.user?.username} </span>
		<form method="POST" action="/?/logout">
			<button type="submit" class=" hover:text-gray-900">Logout</button>
		</form>
	{:else}
		<a class=" hover:text-gray-900" href="/login">Login / Register</a>
	{/if}
</div>
<div class="container mx-auto flex min-h-screen gap-2">
	{#if data.user}
		<div
			class="flex flex-col gap-2 border-r border-gray-300 px-6 py-8 pr-12 text-lg font-medium text-gray-500"
		>
			<a
				class="hover:text-gray-900"
				class:text-gray-900={$page.route.id === '/instruction'}
				href="/instruction">Instructions</a
			>
			<a class="hover:text-gray-900" class:text-gray-900={$page.route.id === '/step'} href="/step"
				>Steps</a
			>
			<a class="hover:text-gray-900" class:text-gray-900={$page.route.id === '/asset'} href="/asset"
				>Assets</a
			>
		</div>
	{/if}
	<div class="grow">
		{@render children()}
	</div>
</div>
