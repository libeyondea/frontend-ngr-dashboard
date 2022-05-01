import http from 'helpers/http';
import config from 'config';
import { Advise, UpdateAdvise } from 'models/advise';
import { ResponseData, ResponseDataPagination } from 'models/response';

const adviseService = {
	list: (page: number = 1, page_size: number = 10, q?: string) => {
		return http.get<ResponseDataPagination<Advise[]>>({
			url: config.API.END_POINT.CRUD_ADVISE,
			params: {
				page,
				page_size,
				q
			}
		});
	},
	show: (id: number) => {
		return http.get<ResponseData<Advise>>({
			url: `${config.API.END_POINT.CRUD_ADVISE}/${id}`
		});
	},
	update: (id: number, data: UpdateAdvise) => {
		return http.put<ResponseData<Advise>>({
			url: `${config.API.END_POINT.CRUD_ADVISE}/${id}`,
			data: data
		});
	},
	delete: (id: number) => {
		return http.delete<ResponseData<any>>({
			url: `${config.API.END_POINT.CRUD_ADVISE}/${id}`
		});
	}
};

export default adviseService;
