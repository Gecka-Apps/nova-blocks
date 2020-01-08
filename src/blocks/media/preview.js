/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	InnerBlocks,
	MediaPlaceholder,
} = wp.blockEditor;

const MediaPreview = function( props ) {
	const {
		attributes: {
			contentStyle,
			blockStyle,
			mediaPosition,
			images,
			proportions,
			gridGap,
			rotate,
			scale,
			offset,
		},
		className,
		updateImages,
		settings,
	} = props;

	const classNames = classnames(
		className,
		`novablocks-media`,
		`has-image-on-the-${ mediaPosition }`,
		`block-is-${ blockStyle }`,
		`content-is-${ contentStyle }`,
		{
			'has-background': blockStyle !== 'basic'
		}
	);

	const galleryImages = images.map( ( image ) => JSON.parse( image ) );

	const displayImages = ( imagesArray ) => {
		if ( 0 === imagesArray.length ) {
			return (
				<MediaPlaceholder
					icon="format-gallery"
					className="novablocks-media__placeholder"
					onSelect={ updateImages }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					multiple
				/>
			);
		}

		return (
			galleryImages.map( ( image ) => {
				return (
					<div key={ image.id } className="novablocks-media__image">
						<img alt={ image.alt } src={ image.url } />
					</div>
				);
			} )
		);
	};

	const style = {
		'--novablocks-media-grid-proportions': proportions,
		'--novablocks-media-grid-gap': gridGap,
		'--novablocks-media-rotate': rotate,
		'--novablocks-media-scale': scale,
		'--novablocks-media-overlap': offset,
	};

	const gridRows = images.length > 2 ? 2 : 1;
	const gridColumns = images.length > 1 ? 2 : 1;

	return (
		<div className={ classNames } style={ style }>
			<div className="wp-block-group__inner-container">
				<div className="wp-block" data-align="wide">
					<div className="novablocks-media__layout">
						<div className="novablocks-media__content">
							<div className="novablocks-media__inner-container">
								<InnerBlocks
									allowedBlocks={ settings.media.allowedBlocks }
									template={ settings.media.template }
								/>
							</div>
						</div>
						<div className="novablocks-media__aside">
							<div className={`novablocks-media__grid novablocks-media__grid--${gridRows}-rows novablocks-media__grid--${gridColumns}-columns`}>
								{ displayImages( images ) }
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MediaPreview;
