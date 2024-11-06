<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container mx-auto flex items-center justify-center py-20">
	<div class="rounded-lg border border-gray-300 p-4 pb-2 shadow-md">
		<div class="text-center text-lg font-medium">Login / Register</div>
		<form class="flex flex-col gap-y-4" method="post" action="?/login" use:enhance>
			<div>
				<Label>Name</Label>
				<Input name="username" />
			</div>
			<div>
				<Label>Password</Label>
				<Input type="password" name="password" />
			</div>
			<div class="flex items-center justify-between gap-2">
				<Button class="w-28" type="submit">LOGIN</Button>
				<button formaction="?/register">
					<Button class="w-28" variant="secondary">REGISTER</Button>
				</button>
			</div>
			<p class="text-center text-red-500">{form?.message ?? ''}</p>
		</form>
	</div>
</div>
