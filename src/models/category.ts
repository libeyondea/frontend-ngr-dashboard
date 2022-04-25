export interface Category {
	id: number;
	parent_id: number | null;
	name: string;
	slug: string;
	children: Category[];
	created_at: string | null;
	updated_at: string | null;
}
