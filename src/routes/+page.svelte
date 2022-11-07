<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Body, classList, style } from 'svelte-body';
	import { GoogleFill } from 'svelte-remixicon';
	import {
		getAuth,
		GoogleAuthProvider,
		onAuthStateChanged,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { addDocument, app, auth } from '$lib/fire_base/firebase';
	import { toast } from '@zerodevx/svelte-toast';
	import { isLoggedOut, lastPage } from '$lib/stores/ketzner';
	import moment from 'moment';

	let styles = "height: 100vh; background-image: url('nfl.jpg'); background-size: cover;";
	let showSignIn = false;
	setTimeout(() => {
		showSignIn = true;
	}, 2000);
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			isLoggedOut.set(false);
			goto($lastPage);
		} else {
			isLoggedOut.set(true);
		}
	});
	let email;
	let password;
	function signIn() {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log(`user : ${result.user}`);
			})
			.catch((error) => {
				console.log(`error: ${error.message}`);
			});
	}
</script>

<svelte:body use:style={styles} />
{#if showSignIn}
	<div class="d-flex align-items-center justify-content-center my-5">
		<div class="card text-center" style="width: 27rem;">
			<img class="card-img-top" src="welcome.jpg" alt="Welcome" />
			<div class="card-body">
				<h6 class="card-text">
					Welcome to Pincore where you'll get your favorite sports odds from over ten sites all in one place. click continue with google and start your journey.
				</h6>
				<br>
				<label for="google"><GoogleFill /></label>
				<button
				id="google"
					type="button"
					class="btn btn-dark btn-rounded"
					on:click={() => signIn(email, password)}>Continue with Google</button
				>
			</div>
		</div>
		<!-- Submit button -->
	</div>
{:else}
	<div class="position-absolute top-50 start-50 translate-middle">
		<div
			class="spinner-grow text-dark opacity-25"
			style="width: 5rem; height: 5rem;"
			role="status"
		/>
	</div>
{/if}
<div class="d-flex justify-content-center align-items-end"><h6>&copy;2022-2023 Pincast</h6></div>
<style>
</style>
