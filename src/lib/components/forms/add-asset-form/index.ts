import z from 'zod';
import AddAssetForm from './add-asset-form.svelte';

const MAX_FILE_SIZE = 5000000;

const zAssetFile = z
	.instanceof(File, { message: 'Please upload a file.'})
	.refine((file: File) => file?.size !== 0, 'File is required')
	.refine((file) => file.size < MAX_FILE_SIZE, 'Max size is 5MB.');

const zAddAssetForm = z.object({
	name: z.string().min(3).max(255),
	assetFile: z.array(zAssetFile).optional()
});

export { AddAssetForm, zAddAssetForm };
