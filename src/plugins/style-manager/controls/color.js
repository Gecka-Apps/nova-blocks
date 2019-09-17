import { STORE_NAME } from "../../../store";
import withBaseControl from './with-base-control';

const { ColorPalette } = wp.components;
const { Component } = wp.element;

const {
	compose,
	createHigherOrderComponent,
	withState,
} = wp.compose;

const ColorControl = ( props ) => {
	const {
		color,
		setState,
		onChange,
		controlOptions,
	} = props;

	return (
		<ColorPalette
			colors={ controlOptions }
			value={ color }
			onChange={ color => {
				setState( { color } );
				if ( typeof onChange === "function" ) {
					onChange( color );
				}
			} }
			disableCustomColors={ true }
			clearable={ false }
		/>
	)
};

const applyWithState = createHigherOrderComponent(
	OriginalComponent => {
		return class extends Component {
			render() {
				const { defaultValue } = this.props;
				const ColorControlWithState = withState( { color: defaultValue } )( OriginalComponent );
				return <ColorControlWithState { ...this.props } />;
			}
		}
	},
);

export default compose([
	withBaseControl,
	applyWithState,
])( ColorControl );
