export interface BlobInfo {
	id: () => string;
	name: () => string;
	filename: () => string;
	blob: () => Blob;
	base64: () => string;
	blobUri: () => string;
	uri: () => string | undefined;
}

export function instanceOfBlobInfo(object: any): object is BlobInfo {
	return (
		'id' in object &&
		'name' in object &&
		'filename' in object &&
		'blob' in object &&
		'base64' in object &&
		'blobUri' in object &&
		'uri' in object
	);
}

export interface Image {
	image: string;
	image_url: string;
}

export interface UploadImage {
	image: File | BlobInfo;
}
