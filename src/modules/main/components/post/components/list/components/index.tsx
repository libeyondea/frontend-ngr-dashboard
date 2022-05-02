import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { Post } from 'models/post';
import { Category } from 'models/category';
import { Fragment, useEffect, useState } from 'react';
import postService from 'services/postService';
import * as routeConstant from 'constants/route';
import * as postConstant from 'constants/post';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import classNames from 'classnames';
import Paginationomponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';
import FilterComponent from 'components/Filter/components';

type Props = {};

const ListPostComponent: React.FC<Props> = () => {
	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState<{
		data: {
			posts: Post[];
		};
		pagination: {
			posts: {
				page: number;
				limit: number;
				limits: number[];
				total: number;
			};
		};
		filter: {
			posts: {
				q: string;
			};
		};
		loading: {
			posts: boolean;
		};
		deleting: {
			posts: boolean;
		};
	}>({
		data: {
			posts: []
		},
		pagination: {
			posts: {
				page: 1,
				limit: 10,
				limits: [10, 20, 50, 100],
				total: 0
			}
		},
		filter: {
			posts: {
				q: ''
			}
		},
		loading: {
			posts: true
		},
		deleting: {
			posts: false
		}
	});

	const onChangePage = (page: number) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				posts: {
					...prevState.pagination.posts,
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
				posts: {
					...prevState.pagination.posts,
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
					posts: {
						...prevState.filter.posts,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					posts: {
						...prevState.pagination.posts,
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
				posts: {
					...prevState.filter.posts,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				posts: {
					...prevState.pagination.posts,
					page: 1
				}
			}
		}));
	};

	const onDeleteClicked = (postId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setState((prevState) => ({
					...prevState,
					deleting: {
						...prevState.deleting,
						posts: true
					}
				}));
				postService
					.delete(postId)
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
								posts: false
							}
						}));
					});
			})
				.then((result) => {
					setState((prevState) => ({
						...prevState,
						loading: {
							...prevState.loading,
							posts: true
						}
					}));
					postService
						.list(state.pagination.posts.page, state.pagination.posts.limit, state.filter.posts.q)
						.then((response) => {
							setState((prevState) => ({
								...prevState,
								data: {
									...prevState.data,
									posts: response.data.data
								},
								pagination: {
									...prevState.pagination,
									posts: {
										...prevState.pagination.posts,
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
									posts: false
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
				posts: true
			}
		}));
		postService
			.list(state.pagination.posts.page, state.pagination.posts.limit, state.filter.posts.q)
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						posts: response.data.data
					},
					pagination: {
						...prevState.pagination,
						posts: {
							...prevState.pagination.posts,
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
						posts: false
					}
				}));
			});
	}, [state.filter.posts.q, state.pagination.posts.limit, state.pagination.posts.page]);

	const recursiveCategories = (categories: Category[], str?: string) => {
		return categories.map((category) => (
			<Fragment key={category.id}>
				<span>
					{str}
					{category.name}
				</span>
				<Fragment>{category.children && recursiveCategories(category.children, ', ')}</Fragment>
			</Fragment>
		));
	};

	return (
		<>
			<BreadcrumbComponent className="mb-4">List posts</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List posts">
						<div className="relative">
							<FilterComponent
								q={formSearch.q}
								handleChangeSearch={handleChangeSearch}
								handleSubmitSearch={handleSubmitSearch}
							/>
							{state.loading.posts ? (
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
																style={{ width: '25%', minWidth: '20rem' }}
															>
																Post
															</th>
															{/* <th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Excerpt
															</th> */}
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
															>
																Status
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ width: '25%', minWidth: '15rem' }}
															>
																Categories
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
														{!state.data.posts.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty posts
																</td>
															</tr>
														) : (
															state.data.posts.map((post) => (
																<tr key={post.id}>
																	<td className="p-3 text-sm">
																		<div className="flex items-center">
																			{/* <div className="flex-shrink-0 h-28 w-36 mr-4">
																				<img
																					className="h-28 w-36"
																					src={post.image_url}
																					alt={post.title}
																				/>
																			</div> */}
																			<div>
																				<div className="text-sm font-medium text-gray-900">
																					{post.title}
																				</div>
																			</div>
																		</div>
																	</td>
																	{/* <td className="p-3 whitespace-normal text-sm text-gray-500">
																		{post.excerpt}
																	</td> */}
																	<td className="p-3 whitespace-nowrap">
																		<span
																			className={classNames(
																				'px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
																				{
																					'bg-green-100 text-green-800':
																						post.status ===
																						postConstant.POST_STATUS_PUBLISH,
																					'bg-yellow-100 text-yellow-800':
																						post.status ===
																						postConstant.POST_STATUS_PENDING,
																					'bg-red-100 text-gray-400':
																						post.status ===
																						postConstant.POST_STATUS_DRAFT
																				}
																			)}
																		>
																			{post.status}
																		</span>
																	</td>
																	<td className="p-3 text-sm text-gray-500 capitalize">
																		{recursiveCategories(post.categories)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.ago(post.updated_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500">
																		{time.format(post.created_at)}
																	</td>
																	<td className="p-3 whitespace-nowrap text-right text-sm font-medium">
																		<div className="flex items-center">
																			<LinkComponent
																				to={`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_POST}/${post.id}/${routeConstant.ROUTE_NAME_MAIN_POST_EDIT}`}
																				className="text-indigo-600 hover:text-indigo-900 mr-2"
																			>
																				<FaRegEdit className="h-5 w-5" />
																			</LinkComponent>
																			<button
																				type="button"
																				className="text-red-600 hover:text-red-900"
																				onClick={() => onDeleteClicked(post.id)}
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
								limits={state.pagination.posts.limits}
								total={state.pagination.posts.total}
								limit={state.pagination.posts.limit}
								currentPage={state.pagination.posts.page}
								onChangePage={onChangePage}
								onChangeLimit={onChangeLimit}
							/>
							<BlockUIComponent isBlocking={state.deleting.posts} />
						</div>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default ListPostComponent;
