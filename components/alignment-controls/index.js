import * as icons from "../../blocks/icons";
import "./style.scss";

import BlockHorizontalAlignmentToolbar from '../block-horizontal-alignment-toolbar';

const { __ } = wp.i18n;

const {
	Component,
	Fragment
} = wp.element;

const {
	BlockVerticalAlignmentToolbar,
} = wp.blockEditor;

const {
	Dropdown,
	IconButton,
	PanelRow,
	Toolbar,
} = wp.components;

class AlignmentToolbar extends Component {

	render() {
		return (
			<Toolbar className='pixelgrade-hero-block-toolbar'>
				<Dropdown
					position='bottom'
					className='pixelgrade-hero-block-toolbar-dropdown'
					contentClassName='components-nova--popover'
					renderToggle={ ( { isOpen, onToggle } ) => (
						<IconButton
							onClick={ onToggle }
							icon={ icons.alignment }
							aria-expanded={ isOpen }
							label={ __( 'Content alignment', '__plugin_txtd' ) }
							labelPosition='bottom'
						/>
					) }
					focusOnMount={ false }
					renderContent={ ( { onClose } ) => <Fragment>
						<AlignmentControls { ...this.props } />
					</Fragment> }
				/>
			</Toolbar>

		)
	}
}

class AlignmentControls extends Component {

	onHorizontalAlignmentChange( horizontalAlignment ) {
		wp.data.select('core/block-editor').getSelectedBlock().innerBlocks.map( block => {
			wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, { align: horizontalAlignment } );
		} );
	}

	render() {

		const {
			attributes: {
				applyMinimumHeightBlock,
				horizontalAlignment,
				verticalAlignment
			},
			setAttributes
		} = this.props;

		return (
			<Fragment>
				<PanelRow>
					<span>{ __( 'Horizontal', '__plugin_txtd' ) }</span>
					<BlockHorizontalAlignmentToolbar
						value={ horizontalAlignment }
						onMouseEnter={ ( horizontalAlignment ) => {
							this.onHorizontalAlignmentChange( horizontalAlignment );
						} }
						onMouseLeave={ () => {
							this.onHorizontalAlignmentChange( horizontalAlignment );
						} }
						onChange={ ( horizontalAlignment ) => {
							this.onHorizontalAlignmentChange( horizontalAlignment );
							setAttributes( { horizontalAlignment } );
						} }
					/>
				</PanelRow>
				{ applyMinimumHeightBlock && <PanelRow>
					<span>{ __( 'Vertical', '__plugin_txtd' ) }</span>
					<BlockVerticalAlignmentToolbar
						value={ verticalAlignment }
						onChange={ ( verticalAlignment ) => { setAttributes( { verticalAlignment } ) } }
					/>
				</PanelRow> }
			</Fragment>
		)
	}
};

export {
	AlignmentControls,
	AlignmentToolbar,
};
