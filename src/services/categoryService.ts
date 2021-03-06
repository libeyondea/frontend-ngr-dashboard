import http from 'helpers/http';
import config from 'config';
import { Category, CreateCategory, UpdateCategory } from 'models/category';
import { ResponseData, ResponseDataPagination } from 'models/response';

const categoryService = {
	list: (page: number = 1, page_size: number = 10, q?: string) => {
		return http.get<ResponseDataPagination<Category[]>>({
			url: config.API.END_POINT.CRUD_CATEGORY,
			params: {
				page,
				page_size,
				q
			}
		});
	},
	show: (id: number) => {
		return http.get<ResponseData<Category>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`
		});
	},
	create: (data: CreateCategory) => {
		return http.post<ResponseData<Category>>({
			url: config.API.END_POINT.CRUD_CATEGORY,
			data: data
		});
	},
	update: (id: number, data: UpdateCategory) => {
		return http.put<ResponseData<Category>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`,
			data: data
		});
	},
	delete: (id: number) => {
		return http.delete<ResponseData<any>>({
			url: `${config.API.END_POINT.CRUD_CATEGORY}/${id}`
		});
	}
};

export default categoryService;
