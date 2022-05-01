import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { useEffect, useState, Fragment } from 'react';
import * as routeConstant from 'constants/route';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import Paginationomponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';
import { Advise } from 'models/advise';
import adviseService from 'services/adviseService';
import FilterComponent from 'components/Filter/components';

type Props = {};

const ListAdviseComponent: React.FC<Props> = () => {
	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState<{
		data: {
			advises: Advise[];
		};
		pagination: {
			advises: {
				page: number;
				limit: number;
				limits: number[];
				total: number;
			};
		};
		filter: {
			advises: {
				q: string;
			};
		};
		loading: {
			advises: boolean;
		};
		deleting: {
			advises: boolean;
		};
	}>({
		data: {
			advises: []
		},
		pagination: {
			advises: {
				page: 1,
				limit: 10,
				limits: [10, 20, 50, 100],
				total: 0
			}
		},
		filter: {
			advises: {
				q: ''
			}
		},
		loading: {
			advises: true
		},
		deleting: {
			advises: false
		}
	});

	const onChangePage = (page: number) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				advises: {
					...prevState.pagination.advises,
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
				advises: {
					...prevState.pagination.advises,
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
					advises: {
						...prevState.filter.advises,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					advises: {
						...prevState.pagination.advises,
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
				advises: {
					...prevState.filter.advises,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				advises: {
					...prevState.pagination.advises,
					page: 1
				}
			}
		}));
	};

	const onDeleteClicked = (adviseId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setState((prevState) => ({
					...prevState,
					deleting: {
						...prevState.deleting,
						advises: true
					}
				}));
				adviseService
					.delete(adviseId)
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
								advises: false
							}
						}));
					});
			})
				.then((result) => {
					setState((prevState) => ({
						...prevState,
						loading: {
							...prevState.deleting,
							advises: true
						}
					}));
					adviseService
						.list(state.pagination.advises.page, state.pagination.advises.limit, state.filter.advises.q)
						.then((response) => {
							setState((prevState) => ({
								...prevState,
								data: {
									...prevState.data,
									advises: response.data.data
								},
								pagination: {
									...prevState.pagination,
									advises: {
										...prevState.pagination.advises,
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
									...prevState.deleting,
									advises: false
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
				...prevState.deleting,
				advises: true
			}
		}));
		adviseService
			.list(state.pagination.advises.page, state.pagination.advises.limit, state.filter.advises.q)
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						advises: response.data.data
					},
					pagination: {
						...prevState.pagination,
						advises: {
							...prevState.pagination.advises,
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
						...prevState.deleting,
						advises: false
					}
				}));
			});
	}, [state.filter.advises.q, state.pagination.advises.limit, state.pagination.advises.page]);

	return (
		<>
			<BreadcrumbComponent className="mb-4">List advises</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List advises">
						<div className="relative">
							<FilterComponent
								q={formSearch.q}
								handleChangeSearch={handleChangeSearch}
								handleSubmitSearch={handleSubmitSearch}
							/>
							{state.loading.advises ? (
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
																Advise
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Email
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
															>
																Phone number
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
														{!state.data.advises.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty advises
																</td>
															</tr>
														) : (
															state.data.advises.map((advise) => (
																<tr key={advise.id}>
																	<td className="p-3 text-sm whitespace-normal">
																		<div className="flex items-center">
																			<div>
																				<div className="text-sm font-medium text-gray-900">
																					{advise.name}
																				</div>
																			</div>
																		</div>
																	</td>
																	<td className="p-3 whitespace-normal text-sm text-gray-500">
																		{advise.email}
																	</td>
																	<td className="p-3 whitespace-normal text-sm text-gray-500">
																		{advise.phone_number}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.ago(advise.updated_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.format(advise.created_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-right text-sm font-medium">
																		<div className="flex items-center">
																			<LinkComponent
																				to={`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_ADVISE}/${advise.id}/${routeConstant.ROUTE_NAME_MAIN_ADVISE_EDIT}`}
																				className="text-indigo-600 hover:textS-indigo-900 mr-2"
																			>
																				<FaRegEdit className="h-5 w-5" />
																			</LinkComponent>
																			<button
																				type="button"
																				className="text-red-600 hover:text-red-900"
																				onClick={() => onDeleteClicked(advise.id)}
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
								limits={state.pagination.advises.limits}
								total={state.pagination.advises.total}
								limit={state.pagination.advises.limit}
								currentPage={state.pagination.advises.page}
								onChangePage={onChangePage}
								onChangeLimit={onChangeLimit}
							/>
							<BlockUIComponent isBlocking={state.deleting.advises} />
						</div>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default ListAdviseComponent;
