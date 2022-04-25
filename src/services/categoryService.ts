import http from 'helpers/http';
import config from 'config';
import { Category } from 'models/category';
import { ResponseData, ResponseDataPagination } from 'models/response';

const categoryService = {
	list: (page: number = 1, page_size: number = 10) => {
		return http.get<ResponseDataPagination<Category[]>>({
			url: config.API.END_POINT.CRUD_CATEGORY,
			params: {
				page,
				page_size
			}
		});
	},
	show: (id: number) => {
		return http.get<ResponseData<Category>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`
		});
	},
	/* create: (data: CreatePost) => {
		return http.post<ResponseData<Category>>({
			url: config.API.END_POINT.CRUD_CATEGORY,
			data: data
		});
	},
	update: (id: number, data: UpdatePost) => {
		return http.put<ResponseData<v>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`,
			data: data
		});
	}, */
	delete: (id: number) => {
		return http.delete<ResponseData<any>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`
		});
	}
};

export default categoryService;
