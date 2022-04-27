import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { Category } from 'models/category';
import { useEffect, useState } from 'react';
import * as routeConstant from 'constants/route';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import classNames from 'classnames';
import Paginationomponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';
import categoryService from 'services/categoryService';

type Props = {};

const ListCategoryComponent: React.FC<Props> = () => {
	const [isLoading, setLoading] = useState(true);
	const [isDeleting, setDeleting] = useState(false);
	const [data, setData] = useState<Category[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		limits: [10, 20, 50, 100],
		total: 0
	});

	const onChangePage = (page: number) => {
		setPagination((prevState) => ({
			...prevState,
			page: page
		}));
	};

	const onChangeLimit = (limit: number) => {
		setPagination((prevState) => ({
			...prevState,
			limit: limit,
			page: 1
		}));
	};

	const onDeleteClicked = (categoryId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setDeleting(true);
				categoryService
					.delete(categoryId)
					.then((response) => {
						return resolve(response);
					})
					.catch((error) => {
						return reject(error);
					})
					.finally(() => {
						setDeleting(false);
					});
			})
				.then((result) => {
					setLoading(true);
					categoryService
						.list(pagination.page, pagination.limit)
						.then((response) => {
							setData(response.data.data);
							setPagination((prevState) => ({
								...prevState,
								total: response.data.pagination.total
							}));
						})
						.catch((error) => {})
						.finally(() => {
							setLoading(false);
						});
				})
				.catch((error) => {})
				.finally(() => {});
		}
	};

	useEffect(() => {
		setLoading(true);
		categoryService
			.list(pagination.page, pagination.limit)
			.then((response) => {
				setData(response.data.data);
				setPagination((prevState) => ({
					...prevState,
					total: response.data.pagination.total
				}));
			})
			.catch((error) => {})
			.finally(() => {
				setLoading(false);
			});
	}, [pagination.limit, pagination.page]);

	const recursiveCategories = (categories: Category[]) => {
		return categories.map((category) => (
			<div key={category.id}>
				<div>{category.name}</div>
				<div className="ml-4">{category.children && recursiveCategories(category.children)}</div>
			</div>
		));
	};

	return (
		<>
			<BreadcrumbComponent className="mb-4">List categories</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List categories">
						<div className="relative">
							{isLoading ? (
								<TableLoadingComponent />
							) : (
								<div className="flex flex-col">
									<div className="overflow-x-auto">
										<div className="align-middle inline-block min-w-full">
											<div className="overflow-hidden border-2 border-gray-200 rounded-md">
												<table className="min-w-full divide-y divide-gray-200">
													<thead className="bg-gray-50">
														<tr>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Category
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Slug
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider whitespace-nowrap"
															>
																Updated at
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider whitespace-nowrap"
															>
																Created at
															</th>
															<th scope="col" className="relative p-3">
																<span className="sr-only">Action</span>
															</th>
														</tr>
													</thead>
													<tbody className="bg-white divide-y divide-gray-200">
														{!data.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty caegories
																</td>
															</tr>
														) : (
															data.map((category) => (
																<tr key={category.id}>
																	<td className="p-3 text-sm whitespace-normal">
																		<div className="flex items-center">
																			<div>
																				<div className="text-sm font-medium text-gray-900">
																					{category.name}
																				</div>
																			</div>
																		</div>
																	</td>
																	<td className="p-3 whitespace-normal text-sm text-gray-500">
																		{category.slug}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.ago(category.updated_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.format(category.created_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-right text-sm font-medium">
																		<div className="flex items-center">
																			<LinkComponent
																				to={`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_CATEGORY}/${category.id}/${routeConstant.ROUTE_NAME_MAIN_CATEGORY_EDIT}`}
																				className="text-indigo-600 hover:text-indigo-900 mr-2"
																			>
																				<FaRegEdit className="h-5 w-5" />
																			</LinkComponent>
																			<button
																				type="button"
																				className="text-red-600 hover:text-red-900"
																				onClick={() => onDeleteClicked(category.id)}
																			>
																				<FaRegTrashAlt className="h-5 w-5" />
																			</button>
																		</div>
																	</td>
																</tr>
															))
														)}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}
							<Paginationomponent
								limits={pagination.limits}
								total={pagination.total}
								limit={pagination.limit}
								currentPage={pagination.page}
								onChangePage={onChangePage}
								onChangeLimit={onChangeLimit}
							/>
							<BlockUIComponent isBlocking={isDeleting} />
						</div>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default ListCategoryComponent;