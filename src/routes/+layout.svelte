<script>
	import { goto } from '$app/navigation';
	import { app, auth } from '$lib/fire_base/firebase';
	import { isLoggedOut } from '$lib/stores/ketzner';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { getAuth, signOut } from 'firebase/auth';
	import {getAnalytics} from "firebase/analytics";
	import { onMount } from 'svelte';

	export const ssr = false;
	
	

	function logout() {
		signOut(auth)
			.then(() => {
				isLoggedOut.set(true)
				goto('/');
			})
			.catch((error) => {
				// An error happened.
			});
	}
	onMount(()=>{
		const analytics = getAnalytics(app)
	})
</script>

<nav class="navbar navbar-expand-sm navbar-dark bg-dark flex-fill mb-0">
	<div class="container-fluid flex-fill">
		<span class="navbar-brand mb-0 h1">Pincore</span>
		<form class="d-flex justify-content-end">
			{#if !$isLoggedOut}
				<button class="btn btn-dark" on:click={logout}><h6>Logout</h6></button>
			{/if}
			
		</form>
	</div>
</nav>
<SvelteToast />
<slot />
