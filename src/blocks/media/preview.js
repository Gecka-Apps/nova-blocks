/**
 * External dependencies
 */
import classnames from 'classnames';

import AdvancedGallery from '../../components/advanced-gallery';

/**
 * WordPress dependencies
 */
const {
	InnerBlocks,
	MediaPlaceholder,
	BlockIcon,
} = wp.blockEditor;

const MediaPreview = function( props ) {
	const {
		attributes: {
			contentStyle,
			blockStyle,
			mediaPosition,
			images,
			// alignment
			verticalAlignment
		},
		className,
		settings,
	} = props;

	const classNames = classnames(
		className,
		`novablocks-block`,
		`novablocks-media`,
		`has-image-on-the-${ mediaPosition }`,
		`novablocks-u-valign-${ verticalAlignment }`,
		`block-is-${ blockStyle }`,
		`content-is-${ contentStyle }`,
		{
			'has-background': blockStyle !== 'basic'
		}
	);

	const passedProps = props;

	if ( images.length && typeof images[0] === 'string' ) {
		passedProps.attributes.images = images.map( image => JSON.parse( image ) );
	}

	return (
		<div className={ classNames }>
			<div className="wp-block-group__inner-container">
				<div className="wp-block" data-align="wide">
					<div className="novablocks-media__layout novablocks-u-content-align">
						<div className="novablocks-media__content">
							<div className="novablocks-media__inner-container novablocks-block__content">
								<InnerBlocks
									allowedBlocks={ settings.media.allowedBlocks }
									template={ settings.media.template }
								/>
							</div>
						</div>
						<div className="novablocks-media__aside">
							<AdvancedGallery { ...passedProps } />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MediaPreview;
