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
																Feedback
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Content
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
														{!state.data.feedback.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty feedback
																</td>
															</tr>
														) : (
															state.data.feedback.map((feedback) => (
																<tr key={feedback.id}>
																	<td className="p-3 text-sm whitespace-normal">
																		<div className="flex items-center">
																			<div className="flex-shrink-0 h-10 w-10 mr-4">
																				<img
																					className="h-10 w-10 rounded-full"
																					src={feedback.avatar_url}
																					alt={feedback.name}
																				/>
																			</div>
																			<div>
																				<div className="text-sm font-medium text-gray-900">
																					{feedback.name}
																				</div>
																			</div>
																		</div>
																	</td>
																	<td className="p-3 whitespace-normal text-sm text-gray-500">
																		{feedback.content}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.ago(feedback.updated_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.format(feedback.created_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-right text-sm font-medium">
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
