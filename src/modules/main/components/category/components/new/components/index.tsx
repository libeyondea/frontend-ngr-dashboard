import axios from 'axios';
import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import { FormikProps, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import * as Yup from 'yup';
import classNames from 'classnames';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Fragment, useEffect, useState } from 'react';
import toastify from 'helpers/toastify';
import { CreateCategoryFormik } from 'models/category';
import categoryService from 'services/categoryService';
import { Category } from 'models/category';
import _ from 'lodash';
import { number } from 'yup/lib/locale';

type Props = {};

const NewCategoryComponent: React.FC<Props> = () => {
	const navigate = useNavigate();

	const [state, setState] = useState<{
		data: {
			categories: Category[];
		};
		loading: {
			categories: boolean;
		};
		creating: {
			category: boolean;
		};
	}>({
		data: {
			categories: []
		},
		loading: {
			categories: true
		},
		creating: {
			category: false
		}
	});

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loading: {
				...prevState.loading,
				categories: true
			}
		}));
		categoryService
			.list(1, 100)
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						categories: response.data.data
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
	}, []);

	const formik: FormikProps<CreateCategoryFormik> = useFormik<CreateCategoryFormik>({
		enableReinitialize: true,
		initialValues: {
			name: '',
			slug: '',
			parent_id: ''
		},
		validationSchema: Yup.object({
			name: Yup.string().required('The name is required.').max(255, 'The name must not be greater than 255 characters.'),
			slug: Yup.string().max(255, 'The slug must not be greater than 255 characters.').nullable(),
			parent_id: Yup.string()
		}),
		onSubmit: (values, { setErrors }) => {
			setState((prevState) => ({
				...prevState,
				creating: {
					...prevState.creating,
					category: true
				}
			}));
			const payload = {
				name: values.name,
				slug: values.slug,
				parent_id: values.parent_id
			};
			categoryService
				.create(payload)
				.then((response) => {
					toastify.success('Create category success');
					navigate(`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_CATEGORY}`);
				})
				.catch((error) => {
					if (axios.isAxiosError(error)) {
						if (error.response?.data.errors && error.response.status === 400) {
							setErrors(error.response.data.errors);
						}
					}
				})
				.finally(() => {
					setState((prevState) => ({
						...prevState,
						creating: {
							...prevState.creating,
							category: false
						}
					}));
				});
		}
	});

	const levelCategories = (level: number) => {
		let test = [];
		for (let i = 0; i < level; i++) {
			test.push(<BsDashLg className="inline-block mr-1 text-gray-400" />);
		}
		return test;
	};

	const recursiveCategories = (categories: Category[]) => {
		return categories.map((category) => (
			<Fragment key={category.id}>
				<option value={category.id}>{category.name}</option>
				<Fragment>{category.children && recursiveCategories(category.children)}</Fragment>
			</Fragment>
		));
	};

	return (
		<>
			<BreadcrumbComponent className="mb-4">New category</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="New category">
						<form onSubmit={formik.handleSubmit}>
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="name" className="inline-block font-medium text-gray-600 mb-1">
										Name
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Enter name"
											className={classNames(
												'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600': formik.errors.name && formik.touched.name
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.name}
											name="name"
											id="name"
										/>
									</div>
									{formik.errors.name && formik.touched.name && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.name}</div>
									)}
								</div>
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="slug" className="inline-block font-medium text-gray-600 mb-1">
										Slug
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Enter slug"
											className={classNames(
												'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600': formik.errors.slug && formik.touched.slug
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.slug}
											name="slug"
											id="slug"
										/>
									</div>
									{formik.errors.slug && formik.touched.slug && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.slug}</div>
									)}
								</div>
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="parent_id" className="inline-block font-medium text-gray-600 mb-1">
										Category
									</label>
									<div className="relative">
										<select
											className={classNames(
												'capitalize rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.parent_id && formik.touched.parent_id
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.parent_id}
											name="parent_id"
											id="parent_id"
											disabled={state.loading.categories || !state.data.categories.length}
										>
											{state.loading.categories ? (
												<option value={''}>Loading...</option>
											) : !state.data.categories.length ? (
												<option value={''}>Empty</option>
											) : (
												<Fragment>
													<option value={''}>---Select---</option>
													{recursiveCategories(state.data.categories)}
												</Fragment>
											)}
										</select>
									</div>
									{formik.errors.parent_id && formik.touched.parent_id && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.parent_id}</div>
									)}
								</div>

								<div className="col-span-2">
									<button
										type="submit"
										className={classNames(
											'flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md',
											{
												'cursor-not-allowed disabled:opacity-50': state.creating.category
											}
										)}
										disabled={state.creating.category}
									>
										{state.creating.category ? (
											<>
												<AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2 font-medium" />
												<span>Creating</span>
											</>
										) : (
											<span>Submit</span>
										)}
									</button>
								</div>
							</div>
						</form>
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default NewCategoryComponent;
