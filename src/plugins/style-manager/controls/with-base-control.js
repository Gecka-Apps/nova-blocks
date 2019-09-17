import { STORE_NAME } from "../store";

const { Component } = wp.element;
const { dispatch, select } = wp.data;
const { compose, createHigherOrderComponent } = wp.compose;

export default ( OriginalComponent ) => {
	const { editPost } = dispatch( 'core/editor' );
	const { updateSetting } = dispatch( STORE_NAME );
	const { getSettings } = select( STORE_NAME );

	return class extends Component {

		onChange( value ) {

			const {
				blockType,
				controlName,
				blockStyle,
				className,
				controlOutputCb,
				...props
			} = this.props;

			const output = controlOutputCb( value );

			updateSetting( blockType.name, blockStyle, controlName, value, output );
			editPost( { novablocks_style_manager_settings: getSettings() } );
		}

		render() {
			const { defaultValue, ...otherProps } = this.props;
			const { blockType, blockStyle, controlName } = this.props;
			const settings = getSettings();

			const newDefaultValue =
				settings[ blockType.name ] &&
				settings[ blockType.name ][ blockStyle ] &&
				settings[ blockType.name ][ blockStyle ][ controlName ] &&
				settings[ blockType.name ][ blockStyle ][ controlName ].value ||
				defaultValue;

			return <OriginalComponent { ...this.props } defaultValue={ newDefaultValue } onChange={ this.onChange.bind( this ) } />
		}
	}
};
