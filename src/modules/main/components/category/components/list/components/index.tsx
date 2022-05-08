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
import TableComponent from 'components/Table/components';
import FilterComponent from 'components/Filter/components';

type Props = {};

const ListCategoryComponent: React.FC<Props> = () => {
	const [formSearch, setFormSearch] = useState({
		q: ''
	});

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
		filter: {
			categories: {
				q: string;
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
		filter: {
			categories: {
				q: ''
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

	const handleChangeSearch = (value: string) => {
		if (!value) {
			setState((prevState) => ({
				...prevState,
				filter: {
					...prevState.filter,
					categories: {
						...prevState.filter.categories,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					categories: {
						...prevState.pagination.categories,
						page: 1
					}
				}
			}));
		}
		setFormSearch({
			q: value
		});
	};

	const handleSubmitSearch = () => {
		setState((prevState) => ({
			...prevState,
			filter: {
				...prevState.filter,
				categories: {
					...prevState.filter.categories,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				categories: {
					...prevState.pagination.categories,
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
						.list(state.pagination.categories.page, state.pagination.categories.limit, state.filter.categories.q)
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
			.list(state.pagination.categories.page, state.pagination.categories.limit, state.filter.categories.q)
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
	}, [state.filter.categories.q, state.pagination.categories.limit, state.pagination.categories.page]);

	const recursiveCategories = (categories: Category[], level: string = '') => {
		return categories.map((category) => (
			<Fragment key={category.id}>
				<TableComponent.Tr>
					<TableComponent.Td>
						<div
							className="text-sm font-medium text-gray-900"
							dangerouslySetInnerHTML={{ __html: level + category.name }}
						/>
					</TableComponent.Td>
					<TableComponent.Td>{category.slug}</TableComponent.Td>
					<TableComponent.Td>{time.ago(category.updated_at)}</TableComponent.Td>
					<TableComponent.Td>{time.format(category.created_at)}</TableComponent.Td>
					<TableComponent.Td>
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
					</TableComponent.Td>
				</TableComponent.Tr>
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
							<FilterComponent
								q={formSearch.q}
								handleChangeSearch={handleChangeSearch}
								handleSubmitSearch={handleSubmitSearch}
							/>
							{state.loading.categories ? (
								<TableLoadingComponent />
							) : (
								<TableComponent>
									<TableComponent.Thead>
										<TableComponent.Tr>
											<TableComponent.Th>Category</TableComponent.Th>
											<TableComponent.Th>Slug</TableComponent.Th>
											<TableComponent.Th>Updated at</TableComponent.Th>
											<TableComponent.Th>Created at</TableComponent.Th>
											<TableComponent.Th>
												<span className="sr-only">Action</span>
											</TableComponent.Th>
										</TableComponent.Tr>
									</TableComponent.Thead>
									<TableComponent.Tbody>
										<Fragment>
											{!state.data.categories.length ? (
												<TableComponent.Tr>
													<TableComponent.Td colSpan={6}>Empty categories</TableComponent.Td>
												</TableComponent.Tr>
											) : (
												recursiveCategories(state.data.categories)
											)}
										</Fragment>
									</TableComponent.Tbody>
								</TableComponent>
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
