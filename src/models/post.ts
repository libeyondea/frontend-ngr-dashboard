import { Category } from './category';
import { User } from './user';

export interface Post {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	image_url: string;
	status: string;
	user: User;
	tags: Array<{
		readonly name: string;
		readonly slug: string;
	}>;
	category_id: number;
	categories: Category[];
	created_at: string | null;
	updated_at: string | null;
}

export interface CreatePost {
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	image?: string | null;
	status: string;
	category_id: number;
	tags: Array<{
		readonly name: string;
		readonly slug: string;
	}>;
}

export interface UpdatePost extends CreatePost {}

export interface CreatePostFormik extends Omit<CreatePost, 'image'> {
	image: File | null;
}

export interface UpdatePostFormik extends CreatePostFormik {}
