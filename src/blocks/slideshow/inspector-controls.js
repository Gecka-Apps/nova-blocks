/**
 * Internal dependencies
 */
import {
	LayoutPanel,
	GalleryPreview,
} from '../../components';

import {getSnapClassname, maybeSnapFocalPoint} from "../../utils";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	FocalPointPicker,
	PanelBody,
	RadioControl,
	RangeControl,
} = wp.components;

const {
	InspectorControls,
} = wp.blockEditor;

const {
	Fragment,
} = wp.element;

const SlideshowInspectorControls = function( props ) {

	const {
		attributes: {
			galleryImages,
			minHeight,
			slideshowType,
		},
		selectedIndex,
		setIndex,
		setAttributes,
		settings: {
			slideshow: {
				minHeightOptions,
			},
		},
	} = props;

	const selectedImage = galleryImages[ selectedIndex ];

	let focalPointPickerClassNames = [ 'novablocks-focal-point-picker' ];

	if ( selectedImage ) {
		let selectedImageFocalPoint = selectedImage.focalPoint || { x: 0.5, y: 0.5 };
		focalPointPickerClassNames.push( getSnapClassname( selectedImageFocalPoint ) )
	}

	focalPointPickerClassNames = focalPointPickerClassNames.join( ' ' );

	let thumbnail,
		width,
		height;

	if ( 'video' === selectedImage?.type ) {
		thumbnail = '//cloud.pixelgrade.com/wp-content/uploads/2020/01/Screenshot-2020-01-09-at-15.59.37.png';
		width = 218;
		height = 170;
	} else {
		thumbnail = selectedImage?.sizes?.thumbnail?.url || selectedImage?.sizes?.large?.url || selectedImage?.sizes?.full?.url
		width = selectedImage?.width;
		height = selectedImage?.height;
	}

	return (
		<InspectorControls>

			{ !! galleryImages.length &&
				<PanelBody
					className={ 'nova-blocks-slideshow-type-panel' }
					title={ __( 'Slides', '__plugin_txtd' ) }>
					<GalleryPreview
						galleryImages={ galleryImages }
						onSelectImage={ setIndex }
						selected={ selectedIndex }
					/>
					{
						selectedImage &&
						<Fragment>
							<FocalPointPicker
								className={ focalPointPickerClassNames }
								url={ thumbnail }
								dimensions={ {
									width: selectedImage.width,
									height: selectedImage.height,
								} }
								value={ selectedImage.focalPoint || { x: 0.5, y: 0.5 } }
								onChange={ focalPoint => {
									const newGalleryImages = galleryImages;
									newGalleryImages[ selectedIndex ].focalPoint = maybeSnapFocalPoint( focalPoint );
									setAttributes( { galleryImages: newGalleryImages } );
								} }
							/>
						</Fragment>
					}
				</PanelBody> }

			{ 'gallery' === slideshowType && <Fragment>

				<LayoutPanel { ...props } />

				<PanelBody title={ __( 'Height', '__plugin_txtd' ) } initialOpen={ false }>
					<RadioControl
						label={ __( 'Minimum Height', '__plugin_txtd' ) }
						selected={ minHeight }
						onChange={ ( nextMinHeight ) => {
							setAttributes( { minHeight: parseInt( nextMinHeight, 10 ) } );
						} }
						options={ minHeightOptions }
					/>
				</PanelBody>

			</Fragment> }

			{ 'gallery' !== slideshowType && <PanelBody>
				{ __( 'Coming Soon', '__plugin_txtd' ) }
			</PanelBody> }

		</InspectorControls>
	);
};

export default SlideshowInspectorControls;
