import { STORE_NAME } from "../../../store";
import withBaseControl from './with-base-control';

const { RadioControl } = wp.components;
const { Component } = wp.element;

const {
	compose,
	createHigherOrderComponent,
	withState,
} = wp.compose;

const Radio = ( props ) => {
	const {
		option,
		setState,
		onChange,
		controlOptions,
		controlLabel,
	} = props;

	return (
		<RadioControl
			label={ controlLabel }
			selected={ option }
			options={ controlOptions }
			onChange={ ( option ) => {
				setState( { option } );

				if ( typeof onChange === "function" ) {
					onChange( option );
				}
			} }
		/>
	)
};

const applyWithState = createHigherOrderComponent(
	OriginalComponent => {
		return class extends Component {
			render() {
				const { defaultValue } = this.props;
				const RadioControlWithState = withState( { option: defaultValue } )( OriginalComponent );
				return <RadioControlWithState { ...this.props } />;
			}
		}
	},
);

export default compose([
	withBaseControl,
	applyWithState,
])( Radio );
