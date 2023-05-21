import { currentUser, pb } from "$lib/pocketbase";

pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model);
});
