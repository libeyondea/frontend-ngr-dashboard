import axios from 'axios';
import BreadcrumbComponent from 'components/Breadcrumb/components';
import CardComponent from 'components/Card/components';
import { FormikProps, useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import classNames from 'classnames';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Fragment, useEffect, useState } from 'react';
import toastify from 'helpers/toastify';
import Loadingomponent from 'components/Loading/components';
import { Advise, UpdateAdviseFormik } from 'models/advise';
import adviseService from 'services/adviseService';

type Props = {};

const EditAdviseComponent: React.FC<Props> = () => {
	const params = useParams();

	const [state, setState] = useState<{
		data: {
			advise: Advise;
		};
		loading: {
			advise: boolean;
		};
		updating: {
			advise: boolean;
		};
	}>({
		data: {
			advise: {} as Advise
		},
		loading: {
			advise: true
		},
		updating: {
			advise: false
		}
	});

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loading: {
				...prevState.loading,
				advise: true
			}
		}));
		adviseService
			.show(Number(params.adviseId))
			.then((response) => {
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						advise: response.data.data
					}
				}));
			})
			.catch((error) => {})
			.finally(() => {
				setState((prevState) => ({
					...prevState,
					loading: {
						...prevState.loading,
						advise: false
					}
				}));
			});
	}, [params.adviseId]);

	const formik: FormikProps<UpdateAdviseFormik> = useFormik<UpdateAdviseFormik>({
		enableReinitialize: true,
		initialValues: {
			name: state.data.advise.name,
			email: state.data.advise.email,
			phone_number: state.data.advise.phone_number,
			content: state.data.advise.content
		},
		validationSchema: Yup.object({
			name: Yup.string().required('The name is required.').max(40, 'The name must not be greater than 40 characters.'),
			email: Yup.string().required('The email is required.'),
			phone_number: Yup.string()
				.required('The phone number is required.')
				.max(20, 'The phone number must not be greater than 20 characters.'),
			content: Yup.string()
				.required('The content is required.')
				.max(6666, 'The content must not be greater than 6666 characters.')
		}),
		onSubmit: (values, { setErrors }) => {
			setState((prevState) => ({
				...prevState,
				updating: {
					...prevState.updating,
					advise: true
				}
			}));
			const payload = {
				name: values.name,
				email: values.email,
				phone_number: values.phone_number,
				content: values.content
			};
			adviseService
				.update(Number(params.adviseId), payload)
				.then((response) => {
					setState((prevState) => ({
						...prevState,
						data: {
							...prevState.data,
							advise: response.data.data
						}
					}));
					toastify.success('Update advise success');
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
							advise: false
						}
					}));
				});
		}
	});

	return (
		<>
			<BreadcrumbComponent className="mb-4">Edit advise</BreadcrumbComponent>
			<div className="grid grid-cols-1 gap-4">
				<div className="col-span-1 w-full">
					<CardComponent header="Edit advise">
						{state.loading.advise ? (
							<Loadingomponent />
						) : (
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
										<label htmlFor="email" className="inline-block font-medium text-gray-600 mb-1">
											Email
										</label>
										<div className="relative">
											<input
												type="email"
												placeholder="Enter email"
												className={classNames(
													'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
													{
														'focus:ring-red-600 border-red-600':
															formik.errors.email && formik.touched.email
													}
												)}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.email}
												name="email"
												id="email"
											/>
										</div>
										{formik.errors.email && formik.touched.email && (
											<div className="text-red-700 mt-1 text-sm">{formik.errors.email}</div>
										)}
									</div>
									<div className="col-span-2 md:col-span-1">
										<label htmlFor="phone_number" className="inline-block font-medium text-gray-600 mb-1">
											Phone number
										</label>
										<div className="relative">
											<input
												type="phone_number"
												placeholder="Enter phone number"
												className={classNames(
													'rounded-md flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent',
													{
														'focus:ring-red-600 border-red-600':
															formik.errors.phone_number && formik.touched.phone_number
													}
												)}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.phone_number}
												name="phone_number"
												id="phone_number"
											/>
										</div>
										{formik.errors.phone_number && formik.touched.phone_number && (
											<div className="text-red-700 mt-1 text-sm">{formik.errors.phone_number}</div>
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
													'cursor-not-allowed disabled:opacity-50': state.updating.advise
												}
											)}
											disabled={state.updating.advise}
										>
											{state.updating.advise ? (
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

export default EditAdviseComponent;
