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
	parent_id: number | '';
	name: string;
	slug: string;
}

export interface UpdateCategory extends CreateCategory {}

export interface CreateCategoryFormik extends CreateCategory {}

export interface UpdateCategoryFormik extends UpdateCategory {}
