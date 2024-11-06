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
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) return redirect(302, '/login');

	const assets = await db.query.asset.findMany({
		with: {
			creator: true,
			updater: true,
			deleter: true
		}
	});

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

		let assetFile: string[] = [];

		if (!locals.user) return fail(403, withFiles({ form }));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		if (form.data.assetFile?.length) {
			for (let i = 0; i < form.data.assetFile.length; i++) {
				const file = form.data.assetFile[i];
				assetFile.push(file.name);
				await fse.mkdirs(`static/assets/${id}`);
				fs.writeFileSync(`static/assets/${id}/${file.name}`, Buffer.from(await file.arrayBuffer()));
			}
		}

		await db.insert(table.asset).values({
			id,
			name: form.data.name,
			assetFile: form.data.assetFile?.join(','),
			createdBy: locals.user.id
		});

		return withFiles({ form });
	},
	editAsset: async ({ request, locals, url }) => {
		const form = await superValidate(request, zod(zEditAssetForm));
		const id = url.searchParams.get('id') as string;

		if (!locals.user) return fail(403, withFiles({ form }));
		if (!id) return fail(404, withFiles({ form }));

		const asset = await db.query.asset.findFirst({
			where: eq(table.asset.id, id)
		});

		let addedAssetFile: string[] = [];
		let removedAssetFile = asset?.assetFile?.split(',') || [];

		if (!asset) return fail(404, withFiles({ form }));
		if (!form.valid) return fail(400, withFiles({ form }));

		if (form.data.addedAssetFile?.length) {
			for (let i = 0; i < form.data.addedAssetFile.length; i++) {
				const file = form.data.addedAssetFile[i];
				addedAssetFile.push(file.name);
				await fse.mkdirs(`static/assets/${id}`);
				fs.writeFileSync(`static/assets/${id}/${file.name}`, Buffer.from(await file.arrayBuffer()));
			}
		}

		if (form.data.removedAssetFile?.length) {
			for (const fileName of form.data.removedAssetFile) {
				removedAssetFile = removedAssetFile.filter((af) => af !== fileName && !!af);
				await fse.remove(`static/assets/${id}/${fileName}`);
			}
		}

		await db
			.update(table.asset)
			.set({
				name: form.data.name,
				assetFile: [...removedAssetFile, ...addedAssetFile].join(','),
				updatedBy: locals.user.id,
				updatedAt: new Date()
			})
			.where(eq(table.asset.id, id));

		return withFiles({ form });
	},
	deleteAsset: async ({ request, locals, url }) => {
		const id = url.searchParams.get('id') as string;

		if (!locals.user) return fail(403);
		if (!id) return fail(404);

		const asset = await db.query.asset.findFirst({
			where: eq(table.asset.id, id)
		});

		if (!asset) return fail(404);

		await db.delete(table.asset).where(eq(table.asset.id, id));
		await fse.remove(`static/assets/${id}`);

		return {};
	}
};
