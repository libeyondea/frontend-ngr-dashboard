import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { Category } from 'models/category';
import { useEffect, useState, Fragment } from 'react';
import * as routeConstant from 'constants/route';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import PaginationComponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';
import categoryService from 'services/categoryService';

type Props = {};

const ListCategoryComponent: React.FC<Props> = () => {
	const [state, setState] = useState<{
		data: {
			categories: Category[];
		};
		pagination: {
			categories: {
				page: number;
				limit: number;
				limits: number[];
				total: number;
			};
		};
		loading: {
			categories: boolean;
		};
		deleting: {
			categories: boolean;
		};
	}>({
		data: {
			categories: []
		},
		pagination: {
			categories: {
				page: 1,
				limit: 10,
				limits: [10, 20, 50, 100],
				total: 0
			}
		},
		loading: {
			categories: true
		},
		deleting: {
			categories: false
		}
	});

	const onChangePage = (page: number) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				categories: {
					...prevState.pagination.categories,
					page: page
				}
			}
		}));
	};

	const onChangeLimit = (limit: number) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				categories: {
					...prevState.pagination.categories,
					limit: limit,
					page: 1
				}
			}
		}));
	};

	const onDeleteClicked = (categoryId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setState((prevState) => ({
					...prevState,
					deleting: {
						...prevState.deleting,
						categories: true
					}
				}));
				categoryService
					.delete(categoryId)
					.then((response) => {
						return resolve(response);
					})
					.catch((error) => {
						return reject(error);
					})
					.finally(() => {
						setState((prevState) => ({
							...prevState,
							deleting: {
								...prevState.deleting,
								categories: false
							}
						}));
					});
			})
				.then((result) => {
					setState((prevState) => ({
						...prevState,
						loading: {
							...prevState.loading,
							categories: true
						}
					}));
					categoryService
						.list(state.pagination.categories.page, state.pagination.categories.limit)
						.then((response) => {
							setState((prevState) => ({
								...prevState,
								data: {
									...prevState.data,
									categories: response.data.data
								},
								pagination: {
									...prevState.pagination,
									categories: {
										...prevState.pagination.categories,
										total: response.data.pagination.total
									}
								}
							}));
						})
						.catch((error) => {})
						.finally(() => {
							setState((prevState) => ({
								...prevState,
								loading: {
									...prevState.loading,
									categories: false
								}
							}));
						});
				})
				.catch((error) => {})
				.finally(() => {});
		}
	};

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loading: {
				...prevState.loading,
				categories: true
			}
		}));
		categoryService
			.list(state.pagination.categories.page, state.pagination.categories.limit)
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						categories: response.data.data
					},
					pagination: {
						...prevState.pagination,
						categories: {
							...prevState.pagination.categories,
							total: response.data.pagination.total
						}
					}
				}));
			})
			.catch((error) => {})
			.finally(() => {
				setState((prevState) => ({
					...prevState,
					loading: {
						...prevState.loading,
						categories: false
					}
				}));
			});
	}, [state.pagination.categories.limit, state.pagination.categories.page]);

	const recursiveCategories = (categories: Category[], level: string = '') => {
		return categories.map((category) => (
			<Fragment key={category.id}>
				<tr>
					<td className="p-3 text-sm whitespace-normal">
						<div className="flex items-center">
							<div>
								<div
									className="text-sm font-medium text-gray-900"
									dangerouslySetInnerHTML={{ __html: level + category.name }}
								/>
							</div>
						</div>
					</td>
					<td className="p-3 whitespace-normal text-sm text-gray-500">{category.slug}</td>
					<td className="p-3 whitespace-nowrap text-sm text-gray-500">{time.ago(category.updated_at)}</td>
					<td className="p-3 whitespace-nowrap text-sm text-gray-500">{time.format(category.created_at)}</td>
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
				<Fragment>{category.children && recursiveCategories(category.children, level + '—&nbsp;')}</Fragment>
			</Fragment>
		));
	};

	return (
		<>
			<BreadcrumbComponent className="mb-4">List categories</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List categories">
						<div className="relative">
							{state.loading.categories ? (
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
														{!state.data.categories.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty categories
																</td>
															</tr>
														) : (
															recursiveCategories(state.data.categories)
														)}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}
							<PaginationComponent
								limits={state.pagination.categories.limits}
								total={state.pagination.categories.total}
								limit={state.pagination.categories.limit}
								currentPage={state.pagination.categories.page}
								onChangePage={onChangePage}
								onChangeLimit={onChangeLimit}
							/>
							<BlockUIComponent isBlocking={state.deleting.categories} />
						</div>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default ListCategoryComponent;
