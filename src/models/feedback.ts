export interface Feedback {
	id: number;
	name: string;
	avatar_url: string;
	content: string;
	created_at: string | null;
	updated_at: string | null;
}

export interface CreateFeedback {
	name: string;
	avatar?: string | null;
	content: string;
}

export interface UpdateFeedback extends CreateFeedback {}

export interface CreateFeedbackFormik extends Omit<CreateFeedback, 'avatar'> {
	image: File | null;
}

export interface UpdateFeedbackFormik extends CreateFeedbackFormik {}
