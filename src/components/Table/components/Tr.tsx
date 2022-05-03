import classNames from 'classnames';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {}

const Tr: React.FC<Props> = ({ children, ...props }) => {
	return (
		<tr {...props} className={classNames('', props.className)}>
			{children}
		</tr>
	);
};

export default Tr;
