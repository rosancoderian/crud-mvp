<script lang="ts">
	import type { Asset } from '$lib/server/db/schema';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm, filesProxy } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zEditAssetForm } from '$lib/components/forms/edit-asset-form';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { X } from 'lucide-svelte';

	type Props = {
		data: SuperValidated<Infer<typeof zEditAssetForm>>;
		asset: Asset;
		action?: string;
	};

	const { data, action = '?/editAsset', asset }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(zEditAssetForm),
		onResult(event) {
			if (event.result.type === 'success') {
				toast.success('Asset edited');
			}
		}
	});

	const files = filesProxy(form, 'addedAssetFile');
	const { form: formData, errors, submitting, enhance, submit, reset } = form;

	$effect(() => {
		if (asset) {
			$formData.name = asset.name;
		}
	});

	export { submit, submitting, reset };
</script>

<form method="POST" {action} enctype="multipart/form-data" use:enhance>
	{#each $formData.removedAssetFile || [] as fileName}
		<input type="hidden" name="removedAssetFile" value={fileName} />
	{/each}
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Label>Name</Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.Description>Name of the asset</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Fieldset {form} name="addedAssetFile">
		<Form.Control>
			{#snippet children({ props })}
				<div>
					<Label>Files</Label>
				</div>
				{#each asset?.assetFile
					?.split(',')
					.filter((af) => !!af && !$formData.removedAssetFile?.includes(af)) || [] as fileName}
					<div class="flex items-center gap-2">
						<span class="line-clamp-1">
							{fileName}
						</span>
						<button
							onclick={(ev) => {
								ev.preventDefault();
								$formData.removedAssetFile = [...$formData.removedAssetFile, fileName];
							}}
						>
							<X class="size-4 stroke-red-500" />
						</button>
					</div>
				{/each}
				{#each $files as file}
					<div class="flex items-center gap-2">
						<span class="line-clamp-1">
							{file.name}
						</span>
					</div>
				{/each}
				<input {...props} name="addedAssetFile" type="file" multiple bind:files={$files} />
			{/snippet}
		</Form.Control>
		<Form.Description>Files of the asset</Form.Description>
		<Form.FieldErrors />
	</Form.Fieldset>
</form>

<SuperDebug data={$formData} />
