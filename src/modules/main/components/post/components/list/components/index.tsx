import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import LinkComponent from 'components/Link/components';
import time from 'helpers/time';
import { Post } from 'models/post';
import { Category } from 'models/category';
import { useEffect, useState } from 'react';
import postService from 'services/postService';
import * as routeConstant from 'constants/route';
import * as postConstant from 'constants/post';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import classNames from 'classnames';
import Paginationomponent from 'components/Pagination/components';
import TableLoadingComponent from 'components/TableLoading/components';
import BlockUIComponent from 'components/BlockUI/components';

type Props = {};

const ListPostComponent: React.FC<Props> = () => {
	const [isLoading, setLoading] = useState(true);
	const [isDeleting, setDeleting] = useState(false);
	const [data, setData] = useState<Post[]>([]);
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

	const onDeleteClicked = (postId: number) => {
		if (window.confirm('Do you want to delete?')) {
			new Promise((resolve, reject) => {
				setDeleting(true);
				postService
					.delete(postId)
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
					postService
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
		postService
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
				{category.translations.map((translation) => (
					<div key={translation.id}>
						<span className="uppercase font-semibold text-blue-600 mr-1">{translation.language.code}:</span>
						<span>{translation.name}</span>
					</div>
				))}
				<div className="ml-4">{category.children && recursiveCategories(category.children)}</div>
			</div>
		));
	};

	return (
		<>
			<BreadcrumbComponent className="mb-4">List posts</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="List posts">
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
																Post
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
																style={{ minWidth: '20rem' }}
															>
																Excerpt
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
															>
																Status
															</th>
															<th
																scope="col"
																className="p-3 text-left text-sm font-medium text-gray-500 tracking-wider"
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
														{!data.length ? (
															<tr>
																<td colSpan={6} className="p-3 whitespace-nowrap text-center">
																	Empty posts
																</td>
															</tr>
														) : (
															data.map((post) => (
																<tr key={post.id}>
																	<td className="p-3 text-sm whitespace-normal">
																		<div className="flex items-center">
																			{/* <div className="flex-shrink-0 h-32 w-32 mr-4">
																				<img
																					className="h-32 w-32"
																					src={post.image_url}
																					alt={post.translations[0].title}
																				/>
																			</div> */}
																			<div>
																				{post.translations.map((translation) => (
																					<div key={translation.id}>
																						<span className="uppercase font-semibold text-blue-600 mr-1">
																							{translation.language.code}:
																						</span>
																						<span className="font-semibold text-gray-900">
																							{translation.title}
																						</span>
																					</div>
																				))}
																			</div>
																		</div>
																	</td>
																	<td className="p-3 whitespace-normal text-sm text-gray-500">
																		{post.translations.map((translation) => (
																			<div key={translation.id}>
																				<span className="uppercase font-semibold text-blue-600 mr-1">
																					{translation.language.code}:
																				</span>
																				<span>{translation.excerpt}</span>
																			</div>
																		))}
																	</td>
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
																	<td className="p-3 whitespace-nowrap text-sm text-gray-500 capitalize">
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

export default ListPostComponent;
