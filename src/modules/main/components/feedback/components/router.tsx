import { Navigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import { lazy, Suspense } from 'react';

import type { RouteObject } from 'react-router-dom';

const ListFeedbackComponent = lazy(() => import('./list/components'));
const EditFeedbackComponent = lazy(() => import('./edit/components'));

const FeedbackRouter: RouteObject[] = [
	{
		path: '',
		element: (
			<Suspense fallback={null}>
				<ListFeedbackComponent />
			</Suspense>
		)
	},
	{
		path: `:feedbackId/${routeConstant.ROUTE_NAME_MAIN_ADVISE_EDIT}`,
		element: (
			<Suspense fallback={null}>
				<EditFeedbackComponent />
			</Suspense>
		)
	},
	{
		path: '*',
		element: <Navigate to={`${routeConstant.ROUTE_NAME_SPLASH}`} />
	}
];

export default FeedbackRouter;
