import { Category } from './category';
import { Language } from './language';
import { Tag } from './tag';
import { User } from './user';

export interface Translations {
	id: number;
	post_id: number;
	language: Language;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface CreatePostTranslations {
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	language_id: number;
}

export interface Post {
	id: number;
	translations: Translations[];
	image_url: string;
	status: string;
	user: User;
	tags: Tag[];
	categories: Category[];
	created_at: string | null;
	updated_at: string | null;
}

export interface CreatePost {
	image?: string | null;
	status: string;
	category_id: number;
	translations: CreatePostTranslations[];
	tags: Array<{
		name: string;
	}>;
}
