<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Body, classList, style } from 'svelte-body';
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



	let styles = "height: 100vh; background-image: url('nfl.jpg'); background-size: cover;"
	let showSignIn = false;
	setTimeout(() => {
		showSignIn = true;
	}, 2000);
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			isLoggedOut.set(false)
			fetch('https://ketzner-sports.uc.r.appspot.com/getTime', { mode: 'cors' }).then((res) => {
				res.json().then((data) => {
					console.log('Saving User');
					let timeNow = moment(data.time);
					addDocument('LastVisit', user.email, { time: timeNow.toString() });
				});
			});
			goto($lastPage);
		}else{
			isLoggedOut.set(true)
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
<svelte:body use:style={styles}></svelte:body>
{#if showSignIn}
	
		<div class="d-flex align-items-center justify-content-center my-5">
			<form class="mt-5">
				<!-- Submit button -->
				<div class="mx-5">
					<button
						type="button"
						class="btn btn-dark btn-block mx-5"
						on:click={() => signIn(email, password)}>Google</button
					>
				</div>
			</form>
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

<style>
	
</style>
