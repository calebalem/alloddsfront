<script>
	import { goto } from '$app/navigation';
	import { app, auth } from '$lib/fire_base/firebase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { getAuth, signOut } from 'firebase/auth';
	


	export const ssr = false;
	function logout() {
		signOut(auth)
			.then(() => {
				goto('/');
			})
			.catch((error) => {
				// An error happened.
			});
	}
</script>

<nav class="navbar navbar-expand-sm navbar-dark bg-dark flex-fill mb-0">
	<div class="container-fluid flex-fill">
		<span class="navbar-brand mb-0 h1">Pinsoft</span>
		<form class="d-flex justify-content-end">
			<button class="btn btn-dark" on:click={logout}><h6>Logout</h6></button>
		</form>
	</div>
	
</nav>
<SvelteToast />
<slot />
