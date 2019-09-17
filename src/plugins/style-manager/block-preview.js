const { __ } = wp.i18n;
const { BlockPreview } = wp.blockEditor;
const { cloneBlock } = wp.blocks;

const MyBlockPreview = ( props ) => {

	const { block, styles, blockStyle } = props;
	const activeStyle = styles.find( style => style.name === blockStyle );

	return (
		<div className="editor-block-styles__item block-editor-block-styles__item">
			<div className="editor-block-styles__item-preview block-editor-block-styles__item-preview">
				<BlockPreview
					viewportWidth={ 500 }
					blocks={ cloneBlock( block ) }
				/>
			</div>
			{ activeStyle && <div className="editor-block-styles__item-label block-editor-block-styles__item-label">
				{ activeStyle.label }
			</div> }
		</div>
	)
};

export default MyBlockPreview;
