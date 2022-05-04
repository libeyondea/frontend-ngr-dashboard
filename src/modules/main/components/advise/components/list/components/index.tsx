import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { useEffect, useState, Fragment } from 'react';
import * as routeConstant from 'constants/route';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import PaginationComponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';
import { Advise } from 'models/advise';
import adviseService from 'services/adviseService';
import FilterComponent from 'components/Filter/components';
import TableComponent from 'components/Table/components';

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
							...prevState.loading,
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
									...prevState.loading,
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
				...prevState.loading,
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
						...prevState.loading,
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
								<TableComponent>
									<TableComponent.Thead>
										<TableComponent.Tr>
											<TableComponent.Th>Advise</TableComponent.Th>
											<TableComponent.Th>Email</TableComponent.Th>
											<TableComponent.Th>Phone number</TableComponent.Th>
											<TableComponent.Th>Updated at</TableComponent.Th>
											<TableComponent.Th>Created at</TableComponent.Th>
											<TableComponent.Th>
												<span className="sr-only">Action</span>
											</TableComponent.Th>
										</TableComponent.Tr>
									</TableComponent.Thead>
									<TableComponent.Tbody>
										<Fragment>
											{!state.data.advises.length ? (
												<TableComponent.Tr>
													<TableComponent.Td colSpan={6}>Empty advises</TableComponent.Td>
												</TableComponent.Tr>
											) : (
												state.data.advises.map((advise) => (
													<TableComponent.Tr key={advise.id}>
														<TableComponent.Td>
															<div className="text-sm font-medium text-gray-900">{advise.name}</div>
														</TableComponent.Td>
														<TableComponent.Td>{advise.email}</TableComponent.Td>
														<TableComponent.Td>{advise.phone_number}</TableComponent.Td>
														<TableComponent.Td>{time.ago(advise.updated_at)}</TableComponent.Td>
														<TableComponent.Td>{time.format(advise.created_at)}</TableComponent.Td>
														<TableComponent.Td>
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
														</TableComponent.Td>
													</TableComponent.Tr>
												))
											)}
										</Fragment>
									</TableComponent.Tbody>
								</TableComponent>
							)}
							<PaginationComponent
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
