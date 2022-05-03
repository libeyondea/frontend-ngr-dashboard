import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {}

const Td: React.FC<Props> = ({ children, ...props }) => {
	return (
		<td {...props} className={classNames('p-3 text-sm text-gray-500', props.className)}>
			{children}
		</td>
	);
};

export default Td;
