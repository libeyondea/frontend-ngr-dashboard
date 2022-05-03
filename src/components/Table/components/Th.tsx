import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {}

const Th: React.FC<Props> = ({ children, ...props }) => {
	return (
		<th
			{...props}
			className={classNames(
				'p-3 text-left text-sm font-medium text-gray-500 tracking-wider whitespace-nowrap',
				props.className
			)}
		>
			{children}
		</th>
	);
};

export default Th;
