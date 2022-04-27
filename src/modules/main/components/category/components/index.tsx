import { useRoutes } from 'react-router-dom';
import CategoryRouter from './router';

type Props = {};

const CategoryComponent: React.FC<Props> = () => {
	return <>{useRoutes(CategoryRouter)}</>;
};

export default CategoryComponent;
