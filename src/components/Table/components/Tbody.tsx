import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {}

const Tbody: React.FC<Props> = ({ children, ...props }) => {
	return (
		<tbody {...props} className={classNames('bg-white divide-y divide-gray-200', props.className)}>
			{children}
		</tbody>
	);
};

export default Tbody;
