export interface Advise {
	id: number;
	name: string;
	email: string;
	phone_number: string;
	content: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface UpdateAdvise {
	name: string;
	email: string;
	phone_number: string;
	content: string;
}

export interface UpdateAdviseFormik extends UpdateAdvise {}
