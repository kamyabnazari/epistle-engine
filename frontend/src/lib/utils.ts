export function showPreview(event: Event) {
	const inputElement = event.target as HTMLInputElement;
	const files = inputElement.files;
	if (files?.length) {
		const src = URL.createObjectURL(files[0]);
		const previewProfile = document.getElementById('avatar-preview-profile') as HTMLImageElement;
		const previewNavbar = document.getElementById('avatar-preview-navbar') as HTMLImageElement;

		previewProfile.src = src;
		previewNavbar.src = src;
	}
}

export const getImageURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const getDocumentURL = (collectionId, recordId, fileName, size = '0x0') => {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};
