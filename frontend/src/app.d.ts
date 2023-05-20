// See https://kit.svelte.dev/docs/types#app

import type { PrismaClient } from '@prisma/client';
import type { PocketBase } from '$lib/pocketbase';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
		}
		// interface PageData {}
		// interface Platform {}
	}
	var prisma: PrismaClient;
}

export {};
