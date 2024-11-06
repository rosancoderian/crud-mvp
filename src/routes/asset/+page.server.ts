import { fail, redirect } from '@sveltejs/kit';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import { db } from '$lib/server/db';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import * as table from '$lib/server/db/schema';
import { guid } from '$lib/utils';
import { zAddAssetForm } from '$lib/components/forms/add-asset-form';
import { zEditAssetForm } from '$lib/components/forms/edit-asset-form';

export const load = async ({ locals }) => {
	if (!locals.user) return redirect(302, '/login');

	const assets = await db.query.asset.findMany();

	const formAddAsset = await superValidate(zod(zAddAssetForm));
	formAddAsset.data.assetFile = [];

	const formEditAsset = await superValidate(zod(zEditAssetForm));

	return {
		assets,
		formAddAsset,
		formEditAsset
	};
};

export const actions = {
	addAsset: async ({ request, locals }) => {
		const form = await superValidate(request, zod(zAddAssetForm));
		const id = guid();

		let assetFile = '';

		if (!locals.user) return fail(403, withFiles({ form }));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		if (form.data.assetFile?.length) {
			for (const file of form.data.assetFile) {
				assetFile += file.name + ',';
				await fse.mkdirs(`static/assets/${id}`);
				fs.writeFileSync(`static/assets/${id}/${file.name}`, Buffer.from(await file.arrayBuffer()));
			}
		}

		await db.insert(table.asset).values({
			id,
			name: form.data.name,
			assetFile,
			createdBy: locals.user.id
		});

		return withFiles({ form });
	}
};
