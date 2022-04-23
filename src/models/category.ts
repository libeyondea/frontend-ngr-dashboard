import { Language } from './language';

export interface Translations {
	id: number;
	category_id: number;
	language: Language;
	name: string;
	slug: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface Category {
	id: number;
	parent_id: number | null;
	translations: Translations[];
	children: Category[];
	created_at: string | null;
	updated_at: string | null;
}
