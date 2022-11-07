<script>
	import { getNbaData } from '$lib/util/util';
	import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
	import { app, auth, getDocument } from '$lib/fire_base/firebase';
	import { allSiteNbaData,lastPage } from '$lib/stores/ketzner';
	import RestartLine from 'svelte-remixicon/lib/icons/RestartLine.svelte';
	import moment, { now } from 'moment';
	import { toast } from '@zerodevx/svelte-toast';
	import { getAuth } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sports } from '$lib/util/sports_list';

	const user = auth.currentUser;
	if (user === null) {
		onMount(() => {
			goto('/');
		});
	}
	let responsiveToogle = true;
    let selected = "/Home/nba"
	const db = getFirestore(app);
	let res;
	let waitModal;
	const unsub = onSnapshot(doc(db, 'NBAUpdateTime', 'time'), (doc) => {
		res = getNbaData();
	});
	let isReloading = false;
	function changeResponsive() {
		responsiveToogle = !responsiveToogle;
	}
	

	function showToast() {
		toast.push('Data is being updated...', {
			theme: {
				'--toastBackground': 'black',
				'--toastColor': 'white',
				'--toastBarBackground': 'white'
			}
		});
	}
    function route(link){
        lastPage.set('/Home/nfl')
		unsub()
		goto(link)
	}
</script>

{#if res != null}
	{#await res}
		{#if Object.keys($allSiteNbaData).length === 0}
			<div class="position-absolute top-50 start-50 translate-middle">
				<div
					class="spinner-grow text-dark opacity-25"
					style="width: 5rem; height: 5rem;"
					role="status"
				/>
			</div>
		{:else}
			<div class="position-absolute top-50 start-50 translate-middle">
				<div
					class="spinner-grow text-dark opacity-25"
					style="width: 5rem; height: 5rem;"
					role="status"
				/>
			</div>
			<div class="p-4">
				{#if responsiveToogle}
					<div class="form-check">
						<input
							class="form-check-input btn-dark"
							type="checkbox"
							bind:value={responsiveToogle}
							id="flexCheckDefault"
							on:click={changeResponsive}
							checked
						/>
						<label class="form-check-label" for="flexCheckDefault"> Toogle View </label>
					</div>
				{:else}
					<div class="form-check">
						<input
							class="form-check-input btn-dark"
							type="checkbox"
							bind:value={responsiveToogle}
							id="flexCheckDefault"
							on:click={changeResponsive}
						/>
						<label class="form-check-label" for="flexCheckDefault"> Toogle View </label>
					</div>
				{/if}
				<div class={responsiveToogle ? 'table-responsive-sm' : 'table'}>
					<table class="table p-5">
						<thead class="table-dark sticky-top">
							<tr>
								<td><span class="spinner-grow spinner-grow-sm" /></td>
								<td
									><select
                                    class="btn btn-dark dropdown-toggle"
                                    type="button"
                                    bind:value={selected}
                                    on:change={() => {
                                        route(selected);
                                    }}
                                >
                                    {#each sports as sport}
                                        <option class="btn-dark" value={sport.link}><h5>{sport.name}</h5> </option>
                                    {/each}
                                </select></td
								>
								{#each $allSiteNbaData.sitesList as site}
									<td
										><a
											class="btn btn-dark btn-sm"
											href={site.link}
											target="_blank"
											rel="noreferrer"><h6>{site.name}</h6></a
										></td
									>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each $allSiteNbaData.games as game, i}
								<tr>
									<td>{i + 1}</td>
									<td><h6>{game.get('home_team')}</h6></td>
									{#each $allSiteNbaData.sitesList as site}
										{#if game.has(`${site.name}_home_moneyline`)}
											{#if game.has(`${site.name}_home_color`)}
												<td class={`${game.get(`${site.name}_home_color`)} text-center`}
													><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_home_moneyline`)}</a></td
												>
											{:else}
												<td class="table-light text-center"
													><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_home_moneyline`)}</a></td
												>
											{/if}
										{:else}
											<td class="table-secondary text-center"><a  class="btn " href={site.link} target="_blank" rel="noreferrer">N/L</a></td>
										{/if}
									{/each}
								</tr>

								<tr class="mb-2">
									<td />
									<td><h6>{game.get('visitor_team')}</h6></td>
									{#each $allSiteNbaData.sitesList as site}
										{#if game.has(`${site.name}_visitor_moneyline`)}
											{#if game.has(`${site.name}_visitor_color`)}
												<td class={`${game.get(`${site.name}_visitor_color`)} text-center`}
													><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_visitor_moneyline`)}</a></td
												>
											{:else}
												<td class="table-light text-center"
													><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_visitor_moneyline`)}</a></td
												>
											{/if}
										{:else}
											<td class="table-secondary text-center"><a  class="btn " href={site.link} target="_blank" rel="noreferrer">N/L</a></td>
										{/if}
									{/each}
								</tr>
								<br />
								<br />
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{:then data}
		<div class="p-4">
			{#if responsiveToogle}
				<div class="form-check">
					<input
						class="form-check-input btn-dark"
						type="checkbox"
						bind:value={responsiveToogle}
						id="flexCheckDefault"
						on:click={changeResponsive}
						checked
					/>
					<label class="form-check-label" for="flexCheckDefault"> Toogle View </label>
				</div>
			{:else}
				<div class="form-check">
					<input
						class="form-check-input btn-dark"
						type="checkbox"
						bind:value={responsiveToogle}
						id="flexCheckDefault"
						on:click={changeResponsive}
					/>
					<label class="form-check-label" for="flexCheckDefault"> Toogle View </label>
				</div>
			{/if}
			<div class={responsiveToogle ? 'table-responsive-sm' : ''}>
				<table class="table" id="table">
					<thead class="table-dark sticky-top">
						<tr>
							{#if isReloading}
								<td>
									<span class="spinner-grow spinner-grow-sm" />
								</td>
							{:else}
								<td
									></td
								>
							{/if}
							<td
								><select
                                class="btn btn-dark dropdown-toggle"
                                type="button"
                                bind:value={selected}
                                on:change={() => {
                                    route(selected);
                                }}
                            >
                                {#each sports as sport}
                                    <option class="btn-dark" value={sport.link}><h5>{sport.name}</h5></option>
                                {/each}
                            </select></td
							>
							{#each data.sitesList as site}
								<td
									><a class="btn btn-dark btn-sm" href={site.link} target="_blank" rel="noreferrer"
										><h6>{site.name}</h6></a
									></td
								>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data.games as game, i}
							<tr>
								<td>{i + 1}</td>
								<td><h6>{game.get('home_team')}</h6></td>
								{#each data.sitesList as site}
									{#if game.has(`${site.name}_home_moneyline`)}
										{#if game.has(`${site.name}_home_color`)}
											<td class={`${game.get(`${site.name}_home_color`)} text-center`}
												><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_home_moneyline`)}</a></td
											>
										{:else}
											<td class="table-light text-center"
												><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_home_moneyline`)}</a></td
											>
										{/if}
									{:else}
										<td class="table-secondary text-center"><a  class="btn " href={site.link} target="_blank" rel="noreferrer">N/L</a></td>
									{/if}
								{/each}
							</tr>

							<tr class="mb-2">
								<td />
								<td><h6>{game.get('visitor_team')}</h6></td>
								{#each data.sitesList as site}
									{#if game.has(`${site.name}_visitor_moneyline`)}
										{#if game.has(`${site.name}_visitor_color`)}
											<td class={`${game.get(`${site.name}_visitor_color`)} text-center`}
												><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_visitor_moneyline`)}</a></td
											>
										{:else}
											<td class="table-light text-center"
												><a  class="btn " href={site.link} target="_blank" rel="noreferrer">{game.get(`${site.name}_visitor_moneyline`)}</a></td
											>
										{/if}
									{:else}
										<td class="table-secondary text-center"><a  class="btn " href={site.link} target="_blank" rel="noreferrer">N/L</a></td>
									{/if}
								{/each}
							</tr>
							<br />
							<br />
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/await}
{/if}

<style>
	
	.form-check-input:checked {
		background-color: black;
	}
    
</style>
