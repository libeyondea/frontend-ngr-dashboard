import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {}

const Thead: React.FC<Props> = ({ children, ...props }) => {
	return (
		<thead {...props} className={classNames('bg-gray-50', props.className)}>
			{children}
		</thead>
	);
};

export default Thead;
