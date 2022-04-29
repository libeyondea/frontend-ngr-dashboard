export interface Category {
	id: number;
	parent_id: number | null;
	name: string;
	slug: string;
	children: Category[];
	created_at: string | null;
	updated_at: string | null;
}

export interface CreateCategory {
	parent_id: string;
	name: string;
	slug: string;
}

export interface CreateCategoryFormik extends CreateCategory {}

export interface UpdateCayegoryFormik extends CreateCategoryFormik {}
