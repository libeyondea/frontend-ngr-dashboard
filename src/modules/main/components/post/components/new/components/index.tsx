import axios from 'axios';
import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import { FormikProps, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import * as userConstant from 'constants/user';
import * as postConstant from 'constants/post';
import * as Yup from 'yup';
import userService from 'services/userService';
import classNames from 'classnames';
import ImageInput from 'components/ImageInput/components';
import imageService from 'services/imageService';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Fragment, useEffect, useState, Component, KeyboardEventHandler } from 'react';
import toastify from 'helpers/toastify';
import { CreatePostFormik } from 'models/post';
import categoryService from 'services/categoryService';
import { Category } from 'models/category';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { CreateTag } from 'models/tag';

type Props = {};

const NewPostComponent: React.FC<Props> = () => {
	const navigate = useNavigate();
	const [isUploading, setUploading] = useState(false);
	const [isCreating, setCreating] = useState(false);
	const [test, setTest] = useState<readonly CreateTag[]>([]);

	/* interface State {
		readonly inputValue: string;
		readonly value: readonly Option[];
	} */

	/* const [test1, setTest1] = useState<State>({
		inputValue: '',
		value: []
	}); */

	const [state, setState] = useState<{
		data: {
			categories: Category[];
		};
		loading: {
			categories: boolean;
		};
		creating: {
			posts: boolean;
		};
		uploading: {
			posts: boolean;
		};
	}>({
		data: {
			categories: []
		},
		loading: {
			categories: true
		},
		creating: {
			posts: false
		},
		uploading: {
			posts: false
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

	const formik: FormikProps<CreatePostFormik> = useFormik<CreatePostFormik>({
		initialValues: {
			title: '',
			slug: '',
			excerpt: '',
			content: '',
			status: postConstant.POST_STATUS_DRAFT,
			category_id: 0,
			tags: [],
			image: null
		},
		validationSchema: Yup.object({
			title: Yup.string().required('The title is required.').max(255, 'The title must not be greater than 255 characters.'),
			slug: Yup.string().max(255, 'The slug must not be greater than 255 characters.').nullable(),
			excerpt: Yup.string()
				.required('The excerpt is required.')
				.max(666, 'The excerpt must not be greater than 666 characters.'),
			content: Yup.string()
				.required('The content is required.')
				.max(60000, 'The content must not be greater than 60000 characters.'),
			category_id: Yup.number().required('The category is required.'),
			tags: Yup.array()
				.required('The tags is required.')
				.min(1, 'The tags must not be less than 1.')
				.max(66, 'The tags must not be greater than 20.'),
			/* .of(
					Yup.object().shape({
						name: Yup.string().required().max(66, 'The tag name must not be greater than 66 characters.')
					})
				) */ status: Yup.string()
				.required('The status is required.')
				.oneOf(
					[
						postConstant.POST_STATUS_DRAFT,
						postConstant.POST_STATUS_PENDING,
						postConstant.POST_STATUS_PUBLISH,
						postConstant.POST_STATUS_TRASH
					],
					'The status invalid.'
				)
		}),
		onSubmit: (values, { setErrors }) => {
			console.log(values);
			/* new Promise<{ image?: string }>((resolve, reject) => {
				if (!values.image) {
					return resolve({});
				}
				setUploading(true);
				imageService
					.upload({
						image: values.image
					})
					.then((response) => {
						return resolve({ image: response.data.data.image });
					})
					.catch((error) => {
						return reject(error);
					})
					.finally(() => {
						setUploading(false);
					});
			})
				.then((result) => {
					setCreating(true);
					const payload = {
						translations: [],
						first_name: values.first_name,
						last_name: values.last_name,
						email: values.email,
						user_name: values.user_name,
						password: values.password,
						role: values.role,
						status: values.status,
						...(result.image && {
							avatar: result.image
						})
					};
					userService
						.create(payload)
						.then((response) => {
							toastify.success('Create user success');
							navigate(`/${routeConstant.ROUTE_NAME_MAIN}/${routeConstant.ROUTE_NAME_MAIN_USER}`);
						})
						.catch((error) => {
							if (axios.isAxiosError(error)) {
								if (error.response?.data.errors && error.response.status === 400) {
									setErrors(error.response.data.errors);
								}
							}
						})
						.finally(() => {
							setCreating(false);
						});
				})
				.catch((error) => {
					if (axios.isAxiosError(error)) {
						if (error.response?.data.errors && error.response.status === 400) {
							setErrors(error.response.data.errors);
						}
					}
				})
				.finally(() => {}); */
		}
	});

	const recursiveCategories = (categories: Category[]) => {
		return categories.map((category) => (
			<Fragment key={category.id}>
				<option value={category.id}>{category.name}</option>
				<Fragment>{category.children && recursiveCategories(category.children)}</Fragment>
			</Fragment>
		));
	};

	/* interface Option {
		readonly label: string;
		readonly value: string;
	}

	const createOption = (label: string) => ({
		label,
		value: label
	});

	const handleChange = (value: OnChangeValue<Option, true>, actionMeta: ActionMeta<Option>) => {
		console.group('Value Changed');
		console.log(value);
		console.log(`action: ${actionMeta.action}`);
		console.groupEnd();
		setTest1((prevState) => ({ ...prevState, value }));
	};
	const handleInputChange = (inputValue: string) => {
		setTest1((prevState) => ({ ...prevState, inputValue }));
	};
	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
		const { inputValue, value } = test1;
		if (!inputValue) return;
		switch (event.key) {
			case 'Enter':
			case 'Tab':
				console.group('Value Added');
				console.log(value);
				console.groupEnd();
				setTest1({
					inputValue: '',
					value: [...value, createOption(inputValue)]
				});
				event.preventDefault();
		}
	}; */

	return (
		<>
			<BreadcrumbComponent className="mb-4">New user</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="New user">
						<form onSubmit={formik.handleSubmit}>
							<div className="grid grid-cols-2 gap-4">
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="title" className="inline-block font-medium text-gray-600 mb-1">
										Title
									</label>
									<div className="relative">
										<input
											type="text"
											placeholder="Enter title"
											className={classNames(
												'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.title && formik.touched.title
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.title}
											name="title"
											id="title"
										/>
									</div>
									{formik.errors.title && formik.touched.title && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.title}</div>
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
								<div className="col-span-2">
									<label htmlFor="excerpt" className="inline-block font-medium text-gray-600 mb-1">
										Excerpt
									</label>
									<div className="relative">
										<textarea
											rows={4}
											placeholder="Enter excerpt"
											className={classNames(
												'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.excerpt && formik.touched.excerpt
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.excerpt}
											name="excerpt"
											id="excerpt"
										></textarea>
									</div>
									{formik.errors.excerpt && formik.touched.excerpt && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.excerpt}</div>
									)}
								</div>
								<div className="col-span-2">
									<label htmlFor="content" className="inline-block font-medium text-gray-600 mb-1">
										Content
									</label>
									<div className="relative">
										<textarea
											rows={8}
											placeholder="Enter content"
											className={classNames(
												'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.content && formik.touched.content
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.content}
											name="v"
											id="content"
										></textarea>
									</div>
									{formik.errors.content && formik.touched.content && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.content}</div>
									)}
								</div>

								<div className="col-span-2 md:col-span-1">
									<label htmlFor="category_id" className="inline-block font-medium text-gray-600 mb-1">
										Category
									</label>
									<div className="relative">
										<select
											className={classNames(
												'capitalize rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.category_id && formik.touched.category_id
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.category_id}
											name="category_id"
											id="category_id"
											disabled={state.loading.categories || !state.data.categories.length}
										>
											{state.loading.categories ? (
												<option value={0}>Loading...</option>
											) : !state.data.categories.length ? (
												<option value={0}>Empty</option>
											) : (
												/* state.data.categories.map((category) => (
													<option value={category.id} key={category.id}>
														{category.name}
													</option>
												)) */
												recursiveCategories(state.data.categories)
											)}
										</select>
									</div>
									{formik.errors.category_id && formik.touched.category_id && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.category_id}</div>
									)}
								</div>
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="tags" className="inline-block font-medium text-gray-600 mb-1">
										Tags
									</label>
									<div className="relative">
										{/* <CreatableSelect
											inputValue={test1.inputValue}
											isClearable
											isMulti
											menuIsOpen={false}
											onChange={handleChange}
											onInputChange={handleInputChange}
											onKeyDown={handleKeyDown}
											placeholder="Type something and press enter..."
											value={test1.value}
										/> */}
										<CreatableSelect
											id="tags"
											name="tags"
											isClearable
											isMulti
											placeholder="Choose tags"
											onChange={(value: OnChangeValue<CreateTag, true>) => {
												console.log(value);
												formik.setFieldValue('tags', value);
											}}
											onInputChange={(inputValue: string) => {
												console.log('inputValue', inputValue);
											}}
											onBlur={() => formik.setFieldTouched('tags', true)}
											value={formik.values.tags}
											/* getNewOptionData={(inputValue, optionLabel) => ({
												id: inputValue,
												name: optionLabel
											})} */
										/>
									</div>
									{formik.errors.tags && formik.touched.tags && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.tags}</div>
									)}
								</div>

								<div className="col-span-2 md:col-span-1">
									<label htmlFor="status" className="inline-block font-medium text-gray-600 mb-1">
										Status
									</label>
									<div className="relative">
										<select
											className={classNames(
												'capitalize rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
												{
													'focus:ring-red-600 border-red-600':
														formik.errors.status && formik.touched.status
												}
											)}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.status}
											name="status"
											id="status"
										>
											{[
												postConstant.POST_STATUS_DRAFT,
												postConstant.POST_STATUS_PENDING,
												postConstant.POST_STATUS_PUBLISH,
												postConstant.POST_STATUS_TRASH
											].map((status, index) => (
												<option value={status} key={index}>
													{status}
												</option>
											))}
										</select>
									</div>
									{formik.errors.status && formik.touched.status && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.status}</div>
									)}
								</div>
								<div className="col-span-2 md:col-span-1">
									<label htmlFor="image" className="inline-block font-medium text-gray-600 mb-1">
										Image
									</label>
									<div className="relative">
										<ImageInput
											name="image"
											id="image"
											onChangeCustom={formik.setFieldValue}
											onBlurCustom={formik.setFieldTouched}
										/>
									</div>
									{formik.errors.image && formik.touched.image && (
										<div className="text-red-700 mt-1 text-sm">{formik.errors.image}</div>
									)}
								</div>
								<div className="col-span-2">
									<button
										type="submit"
										className={classNames(
											'flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md',
											{
												'cursor-not-allowed disabled:opacity-50': isUploading || isCreating
											}
										)}
										disabled={isUploading || isCreating}
									>
										{isUploading ? (
											<>
												<AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2 font-medium" />
												<span>Uploading</span>
											</>
										) : isCreating ? (
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

export default NewPostComponent;
