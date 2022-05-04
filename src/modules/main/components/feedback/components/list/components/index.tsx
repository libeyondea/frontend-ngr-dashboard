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
import { Feedback } from 'models/feedback';
import feedbackService from 'services/feedbackService';
import FilterComponent from 'components/Filter/components';
import TableComponent from 'components/Table/components';

type Props = {};

const ListFeedbackComponent: React.FC<Props> = () => {
	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState<{
		data: {
			feedback: Feedback[];
		};
		pagination: {
			feedback: {
				page: number;
				limit: number;
				limits: number[];
				total: number;
			};
		};
		filter: {
			feedback: {
				q: string;
			};
		};
		loading: {
			feedback: boolean;
		};
		deleting: {
			feedback: boolean;
		};
	}>({
		data: {
			feedback: []
		},
		pagination: {
			feedback: {
				page: 1,
				limit: 10,
				limits: [10, 20, 50, 100],
				total: 0
			}
		},
		filter: {
			feedback: {
				q: ''
			}
		},
		loading: {
			feedback: true
		},
		deleting: {
			feedback: false
		}
	});

	const onChangePage = (page: number) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				feedback: {
					...prevState.pagination.feedback,
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
				feedback: {
					...prevState.pagination.feedback,
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
					feedback: {
						...prevState.filter.feedback,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					feedback: {
						...prevState.pagination.feedback,
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
				feedback: {
					...prevState.filter.feedback,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				feedback: {
					...prevState.pagination.feedback,
					page: 1
				}
			}
		}));
	};

	const onDeleteClicked = (feedbackId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setState((prevState) => ({
					...prevState,
					deleting: {
						...prevState.deleting,
						feedback: true
					}
				}));
				feedbackService
					.delete(feedbackId)
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
								feedback: false
							}
						}));
					});
			})
				.then((result) => {
					setState((prevState) => ({
						...prevState,
						loading: {
							...prevState.loading,
							feedback: true
						}
					}));
					feedbackService
						.list(state.pagination.feedback.page, state.pagination.feedback.limit, state.filter.feedback.q)
						.then((response) => {
							setState((prevState) => ({
								...prevState,
								data: {
									...prevState.data,
									feedback: response.data.data
								},
								pagination: {
									...prevState.pagination,
									feedback: {
										...prevState.pagination.feedback,
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
									feedback: false
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
				feedback: true
			}
		}));
		feedbackService
			.list(state.pagination.feedback.page, state.pagination.feedback.limit, state.filter.feedback.q)
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						feedback: response.data.data
					},
					pagination: {
						...prevState.pagination,
						feedback: {
							...prevState.pagination.feedback,
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
						feedback: false
					}
				}));
			});
	}, [state.filter.feedback.q, state.pagination.feedback.limit, state.pagination.feedback.page]);

	return (
		<>
			<BreadcrumbComponent className="mb-4">List feedback</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List feedback">
						<div className="relative">
							<FilterComponent
								q={formSearch.q}
								handleChangeSearch={handleChangeSearch}
								handleSubmitSearch={handleSubmitSearch}
							/>
							{state.loading.feedback ? (
								<TableLoadingComponent />
							) : (
								<TableComponent>
									<TableComponent.Thead>
										<TableComponent.Tr>
											<TableComponent.Th>Feedback</TableComponent.Th>
											<TableComponent.Th>Content</TableComponent.Th>
											<TableComponent.Th>Updated at</TableComponent.Th>
											<TableComponent.Th>Created at</TableComponent.Th>
											<TableComponent.Th>
												<span className="sr-only">Action</span>
											</TableComponent.Th>
										</TableComponent.Tr>
									</TableComponent.Thead>
									<TableComponent.Tbody>
										<Fragment>
											{!state.data.feedback.length ? (
												<TableComponent.Tr>
													<TableComponent.Td colSpan={6}>Empty feedback</TableComponent.Td>
												</TableComponent.Tr>
											) : (
												state.data.feedback.map((feedback) => (
													<TableComponent.Tr key={feedback.id}>
														<TableComponent.Td className="flex items-center">
															<div className="flex-shrink-0 h-10 w-10 mr-4">
																<img
																	className="h-10 w-10 rounded-full"
																	src={feedback.avatar_url}
																	alt={feedback.name}
																/>
															</div>
															<div className="text-sm font-medium text-gray-900">
																{feedback.name}
															</div>
														</TableComponent.Td>
														<TableComponent.Td>{feedback.content}</TableComponent.Td>
														<TableComponent.Td>{time.ago(feedback.updated_at)}</TableComponent.Td>
														<TableComponent.Td>{time.format(feedback.created_at)}</TableComponent.Td>
														<TableComponent.Td>
															<div className="flex items-center">
																<LinkComponent
																	to={`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_FEEDBACK}/${feedback.id}/${routeConstant.ROUTE_NAME_MAIN_FEEDBACK_EDIT}`}
																	className="text-indigo-600 hover:textS-indigo-900 mr-2"
																>
																	<FaRegEdit className="h-5 w-5" />
																</LinkComponent>
																<button
																	type="button"
																	className="text-red-600 hover:text-red-900"
																	onClick={() => onDeleteClicked(feedback.id)}
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
								limits={state.pagination.feedback.limits}
								total={state.pagination.feedback.total}
								limit={state.pagination.feedback.limit}
								currentPage={state.pagination.feedback.page}
								onChangePage={onChangePage}
								onChangeLimit={onChangeLimit}
							/>
							<BlockUIComponent isBlocking={state.deleting.feedback} />
						</div>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default ListFeedbackComponent;
