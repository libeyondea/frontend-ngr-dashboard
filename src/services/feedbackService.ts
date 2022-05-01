import http from 'helpers/http';
import config from 'config';
import { Feedback, CreateFeedback, UpdateFeedback } from 'models/feedback';
import { ResponseData, ResponseDataPagination } from 'models/response';

const feedbackService = {
	list: (page: number = 1, page_size: number = 10, q?: string) => {
		return http.get<ResponseDataPagination<Feedback[]>>({
			url: config.API.END_POINT.CRUD_FEEDBACK,
			params: {
				page,
				page_size,
				q
			}
		});
	},
	show: (id: number) => {
		return http.get<ResponseData<Feedback>>({
			url: `${config.API.END_POINT.CRUD_FEEDBACK}/${id}`
		});
	},
	create: (data: CreateFeedback) => {
		return http.post<ResponseData<Feedback>>({
			url: config.API.END_POINT.CRUD_FEEDBACK,
			data: data
		});
	},
	update: (id: number, data: UpdateFeedback) => {
		return http.put<ResponseData<Feedback>>({
			url: `${config.API.END_POINT.CRUD_FEEDBACK}/${id}`,
			data: data
		});
	},
	delete: (id: number) => {
		return http.delete<ResponseData<any>>({
			url: `${config.API.END_POINT.CRUD_FEEDBACK}/${id}`
		});
	}
};

export default feedbackService;
