import { Navigate } from 'react-router-dom';
import * as routeConstant from 'constants/route';
import { lazy, Suspense } from 'react';

import type { RouteObject } from 'react-router-dom';

const ListPostComponent = lazy(() => import('./list/components'));
const NewPostComponent = lazy(() => import('./new/components'));
const EditPostComponent = lazy(() => import('./edit/components'));

const PostRouter: RouteObject[] = [
	{
		path: '',
		element: (
			<Suspense fallback={null}>
				<ListPostComponent />
			</Suspense>
		)
	},
	{
		path: `${routeConstant.ROUTE_NAME_MAIN_POST_NEW}`,
		element: (
			<Suspense fallback={null}>
				<NewPostComponent />
			</Suspense>
		)
	},
	{
		path: `:postId/${routeConstant.ROUTE_NAME_MAIN_POST_EDIT}`,
		element: (
			<Suspense fallback={null}>
				<EditPostComponent />
			</Suspense>
		)
	},
	{
		path: '*',
		element: <Navigate to={`${routeConstant.ROUTE_NAME_SPLASH}`} />
	}
];

export default PostRouter;
