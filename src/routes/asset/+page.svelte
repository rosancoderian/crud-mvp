<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Plus, Pencil, Trash } from 'lucide-svelte';
	import { AddAssetForm } from '$lib/components/forms/add-asset-form';
	import { EditAssetForm } from '$lib/components/forms/edit-asset-form';
	import dayjs from 'dayjs';
	import { enhance } from '$app/forms';

	const { data } = $props();

	let formAddAsset: SvelteComponent;
	let formEditAsset: SvelteComponent;
</script>

<div class="container mx-auto py-20">
	<div class="pb-4">
		<Sheet.Root>
			<Sheet.Trigger class={buttonVariants()}>
				<Plus /> ADD ASSET
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[560px]" side="right">
				<Sheet.Header>
					<Sheet.Title>New Asset</Sheet.Title>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					<AddAssetForm bind:this={formAddAsset} data={data.formAddAsset} />
				</div>
				<Sheet.Footer>
					<Sheet.Close class={buttonVariants({ variant: 'ghost' })}>Cancel</Sheet.Close>
					<Button onclick={() => formAddAsset.submit()}>Save</Button>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>ID</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Created At</Table.Head>
				<Table.Head>Updated At</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.assets as asset, i (i)}
				{@const createdAt = asset.createdAt
					? dayjs(asset.createdAt).format('YYYY-MM-DD HH:mm:ss')
					: ''}
				{@const updatedAt = asset.updatedAt
					? dayjs(asset.updatedAt).format('YYYY-MM-DD HH:mm:ss')
					: ''}
				<Table.Row>
					<Table.Cell class="line-clamp-1">{asset.id}</Table.Cell>
					<Table.Cell class="">{asset.name}</Table.Cell>
					<Table.Cell class="">{createdAt}</Table.Cell>
					<Table.Cell class="">{updatedAt}</Table.Cell>
					<Table.Cell class="flex justify-end gap-2">
						<Sheet.Root>
							<Sheet.Trigger class={buttonVariants({ variant: 'secondary' })}>
								<Pencil />
							</Sheet.Trigger>
							<Sheet.Content class="sm:max-w-[560px]" side="right">
								<Sheet.Header>
									<Sheet.Title>
										Edit Asset
										<span class="text-sm text-muted-foreground">{asset?.id || '-'}</span>
									</Sheet.Title>
								</Sheet.Header>
								<div class="grid gap-4 py-4">
									<EditAssetForm bind:this={formEditAsset} data={data.formEditAsset} {asset} />
								</div>
								<Sheet.Footer>
									<Sheet.Close class={buttonVariants({ variant: 'ghost' })}>Cancel</Sheet.Close>
									<Button onclick={() => formEditAsset.submit()}>Save</Button>
								</Sheet.Footer>
							</Sheet.Content>
						</Sheet.Root>
						<form method="POST" action={`?/deleteAsset&id=${asset.id}`} use:enhance>
							<Button type="submit" variant="destructive">
								<Trash />
							</Button>
						</form>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
