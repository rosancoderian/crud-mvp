<script lang="ts">
	import { superForm, type SuperValidated, type Infer, filesProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zAddAssetForm } from '$lib/components/forms/add-asset-form';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	type Props = {
		data: SuperValidated<Infer<typeof zAddAssetForm>>;
		action?: string;
		debug?: boolean;
	};

	const { data, action = '?/addAsset', debug = false }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(zAddAssetForm),
		onResult(event) {
			if (event.result.type === 'success') {
				toast.success('Asset added');
			}
		}
	});

	const files = filesProxy(form, 'assetFile');
	const { form: formData, errors, submitting, enhance, submit, reset } = form;

	export { submit, submitting, reset };
</script>

<form method="POST" {action} enctype="multipart/form-data" use:enhance>
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
	<Form.Fieldset {form} name="assetFile">
		<Form.Control>
			{#snippet children({ props })}
				<div>
					<Label>Files</Label>
				</div>
				{#each $files as file}
					<div class="flex items-center gap-2">
						<span class="line-clamp-1">
							{file.name}
						</span>
					</div>
				{/each}
				<input {...props} name="assetFile" type="file" multiple bind:files={$files} />
			{/snippet}
		</Form.Control>
		<Form.Description>Files of the asset</Form.Description>
		<Form.FieldErrors />
	</Form.Fieldset>
</form>
