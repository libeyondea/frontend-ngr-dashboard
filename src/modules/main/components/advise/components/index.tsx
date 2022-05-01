import { useRoutes } from 'react-router-dom';
import AdviseRouter from './router';

type Props = {};

const AdviseComponent: React.FC<Props> = () => {
	return <>{useRoutes(AdviseRouter)}</>;
};

export default AdviseComponent;
