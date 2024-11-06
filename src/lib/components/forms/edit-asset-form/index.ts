import z from 'zod';
import EditAssetForm from './edit-asset-form.svelte';

const MAX_FILE_SIZE = 5000000;

const zAssetFile = z
	.instanceof(File, { message: 'Please upload a file.'})
	.refine((file: File) => file?.size !== 0, 'File is required')
	.refine((file) => file.size < MAX_FILE_SIZE, 'Max size is 5MB.');

const zEditAssetForm = z.object({
	name: z.string().min(3).max(255),
	addedAssetFile: z.array(zAssetFile).optional().default([]),
	removedAssetFile: z.array(z.string()).optional().default([])
});

export { EditAssetForm, zEditAssetForm };
