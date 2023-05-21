// See https://kit.svelte.dev/docs/types#app

import type { PocketBase } from '$lib/pocketbase';

/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			user: PocketBase['authStore']['model'];
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
