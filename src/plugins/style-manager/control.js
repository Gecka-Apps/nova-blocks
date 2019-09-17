import * as Controls from './controls';

const Control = ( props ) => {
	const { controlType } = props;
	const Component = Controls[ controlType ];

	if ( controlType ) {
		return <Component { ...props } />
	} else {
		return null;
	}
}

export default Control;
