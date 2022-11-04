import {writable} from 'svelte/store'

export const allSiteNflData = writable({})
export const allSiteNbaData = writable({})
export const loading = writable(false)
export const lastPage = writable("/Home/nfl")
export const isLoggedOut = writable(false)