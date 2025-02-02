/**
 * WordPress dependencies
 */

import EditableText from '../../components/editable-text';
import * as icons from "../../icons";

const {
	InnerBlocks,
	MediaUpload,
} = wp.blockEditor;

const {
	createHigherOrderComponent
} = wp.compose;

const {
	select,
	dispatch,
} = wp.data;

const CardEdit = ( props ) => {

	const blockClassName = 'novablocks-card';

	const {
		attributes: {
			level,
			title,
			subtitle,
			description,
			media,
			meta,

			contentAlign,
			showMedia,
			showTitle,
			showSubtitle,
			showDescription,
			showButtons,
			showMeta,
		},
		className,
		setAttributes,
	} = props;

	const CardMedia = ( props ) => {

		const {
			attributes: {
				media
			},
			open,
		} = props;

		if ( !! media && !! media.url ) {
			return <img className={ `${ blockClassName }__media-image` } src={ media.url } onClick={ open } />
		}

		return (
			<div className={ `${ blockClassName }__media-placeholder` } onClick={ open }>
				{ icons.placeholder }
			</div>
		);
	};

	return (
		<div className={ `${ blockClassName } ${ className } novablocks-card__inner-container novablocks-block__content` }>
			<div className="block-editor-block-list__layout">
				{
					showMedia &&
					<div className={ `${ blockClassName }__media-wrap block-editor-block-list__block` }>
						<div className={ `${ blockClassName }__media` }>
							<MediaUpload
								type="image"
								value={ !! media && media.id }
								onSelect={ ( media ) => setAttributes( { media } ) }
								render={ ( { open } ) => (
									<CardMedia { ...props } open={ open } />
								) }
							/>
						</div>
					</div>
				}
				{
					showMeta &&
					<EditableText
						className={ `${ blockClassName }__meta block-editor-block-list__block is-style-meta` }
						tagName={ 'p' }
						value={meta}
						onChange={meta => {
							setAttributes( {meta} )
						}}
					/>
				}
				{
					showTitle &&
					<EditableText
						className={`${blockClassName}__title block-editor-block-list__block`}
						tagName={`h${level + 1}`}
						value={title}
						onChange={title => {
							setAttributes( {title} )
						}} />
				}
				{
					showSubtitle &&
					<EditableText
						className={ `${ blockClassName }__subtitle block-editor-block-list__block` }
						tagName={ `h${level + 2}` }
						value={subtitle}
						onChange={subtitle => {
							setAttributes( {subtitle} )
						}}
					/>
				}
				{
					showDescription &&
					<EditableText
						className={ `${ blockClassName }__description block-editor-block-list__block` }
						tagName={ 'p' }
						value={description}
						onChange={description => {
							setAttributes( {description} )
						}}
					/>
				}
				{
					showButtons &&
					<div className={ `${ blockClassName }__buttons block-editor-block-list__block` }>
						<InnerBlocks
							allowedBlocks={ [ 'core/buttons' ] }
							renderAppender={ false }
							template={ [
								[ 'core/buttons', { align: contentAlign },
									[ [ 'core/button', { text: 'Button', className: 'is-style-text' } ] ]
								]
							] }
						/>
					</div>
				}
			</div>
		</div>
	);
}

const withCollectionVisibilityAttributes = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( 'novablocks/card' === props.name ) {
			const { clientId } = props;
			const { getBlock, getBlockParentsByBlockName } = select( 'core/block-editor' );
			const block = getBlock( clientId );
			const { innerBlocks } = block;

			const parents = getBlockParentsByBlockName( clientId, 'novablocks/cards-collection' );
			const parentClientId = parents[0];
			const parentBlock = getBlock( parentClientId );

			const newAttributes = (
				( { level, contentAlign, showMedia, showTitle, showSubtitle, showDescription, showButtons, showMeta } ) => (
					{ level, contentAlign, showMedia, showTitle, showSubtitle, showDescription, showButtons, showMeta }
				)
			)( parentBlock.attributes );

			dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, newAttributes );

			innerBlocks.forEach( innerBlock => {
				dispatch( 'core/block-editor' ).updateBlockAttributes( innerBlock.clientId, {
					align: newAttributes.contentAlign
				} );
			} )
		}
		return <BlockListBlock { ...props } />
	};
}, 'withCollectionVisibilityAttributes' );

wp.hooks.addFilter( 'editor.BlockListBlock', 'novablocks/with-collection-visibility-attributes', withCollectionVisibilityAttributes );

export default CardEdit;
