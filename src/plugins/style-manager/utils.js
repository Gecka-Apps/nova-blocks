import { STORE_NAME } from "./store";
const { withSelect } = wp.data;
const { tokenList } = wp;

export function getActiveStyle( styles, className ) {

	for ( const style of new tokenList( className ).values() ) {
		if ( style.indexOf( 'is-style-' ) === -1 ) {
			continue;
		}

		const potentialStyleName = style.substring( 9 );
		const activeStyle = styles.find( style => style.name === potentialStyleName );
		if ( activeStyle ) {
			return activeStyle.name;
		}
	}

	const defaultStyle = styles.find( style => !! style.isDefault );

	if ( defaultStyle ) {
		return defaultStyle.name;
	}

	return false;
}

export const withTypeAndStyle = withSelect( ( select, ownProps ) => {
	const { getSelectedBlock } = select( 'core/block-editor' );
	const { getBlockStyles } = select( 'core/blocks' );
	const { getBlockType } = wp.blocks;
	const { getSettings } = select( STORE_NAME );

	const block = getSelectedBlock();

	if ( ! block ) {
		return ownProps;
	}

	const blockType = getBlockType( block.name );
	const styles = getBlockStyles( block.name );
	const className = block.attributes.className || '';
	const blockStyle = getActiveStyle( styles, className );

	return {
		...ownProps,
		block,
		blockType,
		styles,
		blockStyle,
	};
} );
