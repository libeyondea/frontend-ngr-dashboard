import { Navigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import { lazy, Suspense } from 'react';

import type { RouteObject } from 'react-router-dom';

const ListCategoryComponent = lazy(() => import('./list/components'));
const NewCategoryComponent = lazy(() => import('./new/components'));
const EditCategoryComponent = lazy(() => import('./edit/components'));

const CategoryRouter: RouteObject[] = [
	{
		path: '',
		element: (
			<Suspense fallback={null}>
				<ListCategoryComponent />
			</Suspense>
		)
	},
	{
		path: `${routeConstant.ROUTE_NAME_MAIN_CATEGORY_NEW}`,
		element: (
			<Suspense fallback={null}>
				<NewCategoryComponent />
			</Suspense>
		)
	},
	{
		path: `:categoryId/${routeConstant.ROUTE_NAME_MAIN_CATEGORY_EDIT}`,
		element: (
			<Suspense fallback={null}>
				<EditCategoryComponent />
			</Suspense>
		)
	},
	{
		path: '*',
		element: <Navigate to={`${routeConstant.ROUTE_NAME_SPLASH}`} />
	}
];

export default CategoryRouter;
