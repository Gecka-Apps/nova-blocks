/**
 * Internal dependencies
 */
import withSettings from '../with-settings';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	PanelBody,
	RadioControl,
	ToggleControl,
} = wp.components;

const {
	select,
} = wp.data;

const {
	Component
} = wp.element;

const ScrollIndicatorPanel = withSettings( function( props ) {
	const {
		settings,
		attributes: {
			scrollIndicator,
		},
		setAttributes,
		updateAttributes,
	} = props;

	const heroBlocks = select( 'core/block-editor' ).getBlocks().filter( ( block ) => {
		return block.name === 'novablocks/hero';
	} );

	const index = heroBlocks.findIndex( block => block.clientId === select( 'core/block-editor' ).getSelectedBlockClientId() );

	return (
		index === 0 &&
		<PanelBody title={ __( 'Scroll Indicator', '__plugin_txtd' ) } initialOpen={ false }>
			<ToggleControl
				label={ __( 'Enable Scroll Indicator', '__plugin_txtd' ) }
				checked={ scrollIndicator }
				onChange={ scrollIndicator => { updateAttributes( { scrollIndicator } ) } }
			/>
		</PanelBody>
	);
} );

export {
	ScrollIndicatorPanel,
};
