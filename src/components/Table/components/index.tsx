import Tbody from './Tbody';
import Td from './Td';
import Th from './Th';
import Thead from './Thead';
import Tr from './Tr';

type Props = {};

const TableComponent: React.FC<Props> = ({ children }) => {
	return (
		<div className="flex flex-col">
			<div className="overflow-x-auto">
				<div className="align-middle inline-block min-w-full">
					<div className="overflow-hidden border-2 border-gray-200 rounded-md">
						<table className="min-w-full divide-y divide-gray-200">{children}</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Object.assign(TableComponent, {
	Thead: Thead,
	Tr: Tr,
	Th: Th,
	Tbody: Tbody,
	Td: Td
});
