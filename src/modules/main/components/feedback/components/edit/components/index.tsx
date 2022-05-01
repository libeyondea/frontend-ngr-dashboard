import axios from 'axios';
import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import { FormikProps, useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import classNames from 'classnames';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import toastify from 'helpers/toastify';
import Loadingomponent from 'components/Loading/components';
import feedbackService from 'services/feedbackService';
import { Feedback, UpdateFeedbackFormik } from 'models/feedback';
import imageService from 'services/imageService';
import ImageInput from 'components/ImageInput/components';

type Props = {};

const EditFeedbackComponent: React.FC<Props> = () => {
	const params = useParams();

	const [state, setState] = useState<{
		data: {
			feedback: Feedback;
		};
		loading: {
			feedback: boolean;
		};
		updating: {
			feedback: boolean;
		};
		uploading: {
			feedback: boolean;
		};
	}>({
		data: {
			feedback: {} as Feedback
		},
		loading: {
			feedback: true
		},
		updating: {
			feedback: false
		},
		uploading: {
			feedback: false
		}
	});

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loading: {
				...prevState.loading,
				feedback: true
			}
		}));
		feedbackService
			.show(Number(params.feedbackId))
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						feedback: response.data.data
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
	}, [params.feedbackId]);

	const formik: FormikProps<UpdateFeedbackFormik> = useFormik<UpdateFeedbackFormik>({
		enableReinitialize: true,
		initialValues: {
			name: state.data.feedback.name,
			content: state.data.feedback.content,
			image: null
		},
		validationSchema: Yup.object({
			name: Yup.string().required('The name is required.').max(40, 'The name must not be greater than 40 characters.'),
			content: Yup.string()
				.required('The content is required.')
				.max(666, 'The content must not be greater than 666 characters.')
		}),
		onSubmit: (values, { setErrors }) => {
			new Promise<{ image?: string }>((resolve, reject) => {
				if (!values.image) {
					return resolve({});
				}
				setState((prevState) => ({
					...prevState,
					uploading: {
						...prevState.uploading,
						feedback: true
					}
				}));
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
						setState((prevState) => ({
							...prevState,
							uploading: {
								...prevState.uploading,
								feedback: false
							}
						}));
					});
			})
				.then((result) => {
					setState((prevState) => ({
						...prevState,
						updating: {
							...prevState.updating,
							feedback: true
						}
					}));
					const payload = {
						name: values.name,
						content: values.content,
						...(result.image && {
							avatar: result.image
						})
					};
					feedbackService
						.update(Number(params.feedbackId), payload)
						.then((response) => {
							setState((prevState) => ({
								...prevState,
								data: {
									...prevState.data,
									feedback: response.data.data
								}
							}));
							toastify.success('Update feedback success');
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
								updating: {
									...prevState.updating,
									feedback: false
								}
							}));
						});
				})
				.catch((error) => {
					if (axios.isAxiosError(error)) {
						if (error.response?.data.errors && error.response.status === 400) {
							setErrors(error.response.data.errors);
						}
					}
				})
				.finally(() => {});
		}
	});

	return (
		<>
			<BreadcrumbComponent className="mb-4">Edit feedback</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="Edit feedback">
						{state.loading.feedback ? (
							<Loadingomponent />
						) : (
							<form onSubmit={formik.handleSubmit}>
								<div className="grid grid-cols-2 gap-4">
									<div className="col-span-2">
										<label htmlFor="image" className="inline-block font-medium text-gray-600 mb-1">
											Avatar
										</label>
										<div className="relative">
											<ImageInput
												name="image"
												id="image"
												onChangeCustom={formik.setFieldValue}
												onBlurCustom={formik.setFieldTouched}
												imgUrl={state.data.feedback.avatar_url}
											/>
										</div>
										{formik.errors.image && formik.touched.image && (
											<div className="text-red-700 mt-1 text-sm">{formik.errors.image}</div>
										)}
									</div>
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
														'focus:ring-red-600 border-red-600':
															formik.errors.name && formik.touched.name
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
												name="content"
												id="content"
											/>
										</div>
										{formik.errors.content && formik.touched.content && (
											<div className="text-red-700 mt-1 text-sm">{formik.errors.content}</div>
										)}
									</div>
									<div className="col-span-2">
										<button
											type="submit"
											className={classNames(
												'flex items-center justify-center py-3 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md',
												{
													'cursor-not-allowed disabled:opacity-50':
														state.uploading.feedback || state.updating.feedback
												}
											)}
											disabled={state.uploading.feedback || state.updating.feedback}
										>
											{state.uploading.feedback ? (
												<>
													<AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2 font-medium" />
													<span>Uploading</span>
												</>
											) : state.updating.feedback ? (
												<>
													<AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-2 font-medium" />
													<span>Updating</span>
												</>
											) : (
												<span>Submit</span>
											)}
										</button>
									</div>
								</div>
							</form>
						)}
					</CardComponent>
				</div>
			</div>
		</>
	);
};

export default EditFeedbackComponent;
