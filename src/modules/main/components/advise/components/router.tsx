import { Navigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import { lazy, Suspense } from 'react';

import type { RouteObject } from 'react-router-dom';

const ListAdviseComponent = lazy(() => import('./list/components'));
const EditAdviseComponent = lazy(() => import('./edit/components'));

const AdviseRouter: RouteObject[] = [
	{
		path: '',
		element: (
			<Suspense fallback={null}>
				<ListAdviseComponent />
			</Suspense>
		)
	},
	{
		path: `:adviseId/${routeConstant.ROUTE_NAME_MAIN_ADVISE_EDIT}`,
		element: (
			<Suspense fallback={null}>
				<EditAdviseComponent />
			</Suspense>
		)
	},
	{
		path: '*',
		element: <Navigate to={`${routeConstant.ROUTE_NAME_SPLASH}`} />
	}
];

export default AdviseRouter;
