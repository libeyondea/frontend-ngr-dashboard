import { useRoutes } from 'react-router-dom';
import PostRouter from './router';

type Props = {};

const PostComponent: React.FC<Props> = () => {
	return <>{useRoutes(PostRouter)}</>;
};

export default PostComponent;
