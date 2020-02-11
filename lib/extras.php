<?php

/**
 * Determine if a certain block is supported by the current theme.
 *
 * This way you can current_theme_supports() with a second parameter like so:
 * current_theme_supports( 'novablocks', 'hero');
 * current_theme_supports( 'novablocks', array( 'hero', 'media' ) );
 *
 * @param bool $supports
 * @param string|array $args A single block or a list of blocks to search for.
 *                           When multiple, we use AND among them, so all need to be supported.
 * @param array|bool $theme_features The list of novablocks blocks (as strings) that the current theme supports.
 *
 * @return mixed
 */
function novablocks_handle_theme_supports( $supports, $args, $theme_features ) {
	if ( empty( $args ) || empty( $theme_features ) ) {
		return $supports;
	}

	if ( is_string( $args ) ) {
		$args = array( $args );
	}

	if ( is_array( $theme_features ) ) {
		$theme_features = reset( $theme_features );
	}
	if ( is_string( $theme_features ) ) {
		$theme_features = array( $theme_features );
	}
	if ( ! is_array( $theme_features ) ) {
		return $supports;
	}

	foreach ( $args as $arg ) {
		if ( ! in_array( $arg, $theme_features ) ) {
			return false;
		}
	}

	return true;
}

add_filter( 'current_theme_supports-novablocks', 'novablocks_handle_theme_supports', 10, 3 );

function novablocks_register_settings() {
	register_setting(
		'novablocks',
		'novablocks_google_maps_api_key',
		array(
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
}

add_action( 'admin_init', 'novablocks_register_settings' );
add_action( 'rest_api_init', 'novablocks_register_settings' );

function novablocks_register_meta() {

	if ( defined( 'NOVABLOCKS_USE_POST_META_ATTRIBUTES' ) && NOVABLOCKS_USE_POST_META_ATTRIBUTES ) {
		register_meta( 'post', 'novablocks_hero_scroll_indicator', array(
			'type'         => 'boolean',
			'single'       => true,
			'show_in_rest' => true,
		) );

		register_meta( 'post', 'novablocks_hero_position_indicators', array(
			'type'         => 'boolean',
			'single'       => true,
			'show_in_rest' => true,
		) );
	}
}

add_action( 'init', 'novablocks_register_meta' );

function novablocks_allowed_block_types( $allowed_block_types, $post ) {

	if ( $post->post_type === 'block_area' ) {

		if ( $post->post_name === 'header' ) {
			return array( 'novablocks/header' );
		}

		if ( $post->post_name === 'promo-bar' ) {
			return array( 'novablocks/announcement-bar' );
		}
	}

	return $allowed_block_types;
}

add_filter( 'allowed_block_types', 'novablocks_allowed_block_types', 10, 2 );

function novablocks_get_content_padding_attributes() {
	return array(
		'contentPadding'       => array(
			'type'    => 'string',
			'default' => 'medium',
		),
		'contentPaddingCustom' => array(
			'type'    => 'number',
			'default' => 75
		),
	);
}

function novablocks_get_content_width_attributes() {
	return array(
		'contentWidth'       => array(
			'type'    => 'string',
			'default' => 'large'
		),
		'contentWidthCustom' => array(
			'type'    => 'number',
			'default' => 100
		),
	);
}

function novablocks_get_advanced_gallery_attributes() {

	$defaults = array(
		'images'             => array(
			'type'    => 'array',
			'default' => array(),
		),
		'stylePreset'        => array(
			'type'    => 'string',
			'default' => 'creative',
		),
		'sizeContrast'       => array(
			'type'    => 'number',
			'default' => 0,
		),
		'positionShift'      => array(
			'type'    => 'number',
			'default' => 0,
		),
		'elementsDistance'   => array(
			'type'    => 'number',
			'default' => 1,
		),
		'placementVariation' => array(
			'type'    => 'number',
			'default' => 0,
		),
		'imageRotation'      => array(
			'type'    => 'number',
			'default' => 0,
		),
		'imageResizing'      => array(
			'type'    => 'string',
			'default' => 'cropped',
		),
		'containerHeight'    => array(
			'type'    => 'number',
			'default' => 0,
		),
		'objectPosition'     => array(
			'type'    => 'number',
			'default' => 50,
		),
		'verticalSpacing'    => array(
			'type'    => 'number',
			'default' => 0,
		),
	);

	if ( ! isset( $defaults['stylePreset']['default'] ) ) {
		return $defaults;
	}

	$defaultPresetSlug = $defaults['stylePreset']['default'];
	$presetOptions = novablocks_get_advanced_gallery_presets();

	$defaultPreset = array();

	foreach ( $presetOptions as $preset ) {
		if ( $preset['value'] === $defaultPresetSlug ) {
			$defaultPreset = $preset['preset'];
		}
	}

	if ( empty( $defaultPreset ) ) {
		return $defaults;
	}

	foreach ( $defaultPreset as $key => $value ) {
		if ( isset( $defaults[$key] ) ) {
			$defaults[$key]['default'] = $value;
		}
	}

	return $defaults;
}

function novablocks_get_color_attributes() {
	return array(
		'contentColor'          => array(
			'type'    => 'string',
			'default' => '#FFF'
		),
		'overlayFilterStyle'    => array(
			'type'    => 'string',
			'default' => 'dark'
		),
		'overlayFilterStrength' => array(
			'type'    => 'number',
			'default' => 30
		),
	);
}

function novablocks_get_alignment_attributes() {
	return array(
		'horizontalAlignment' => array(
			'type'    => 'string',
			'default' => 'center',
		),
		'verticalAlignment'   => array(
			'type'    => 'string',
			'default' => 'center'
		),
	);
}

function novablocks_get_doppler_attributes() {
	return array(
		'focalPoint'             => array(
			'type'    => 'object',
			'default' => array(
				'x' => 0.5,
				'y' => 0.5
			),
		),
		'finalFocalPoint'        => array(
			'type'    => 'object',
			'default' => array(
				'x' => 0.5,
				'y' => 0.5
			),
		),
		'initialBackgroundScale' => array(
			'type'    => 'number',
			'default' => 1
		),
		'finalBackgroundScale'   => array(
			'type'    => 'number',
			'default' => 1
		),
		'scrollIndicatorBlock'   => array(
			'type'    => 'boolean',
			'default' => false
		),
		'scrollingEffect'        => array(
			'type'    => 'string',
			'default' => 'parallax',
		),
		'motionPreset'           => array(
			'type'    => 'string',
			'default' => 'standard-dynamic',
		),
		'followThroughStart'     => array(
			'type'    => 'boolean',
			'default' => true,
		),
		'followThroughEnd'       => array(
			'type'    => 'boolean',
			'default' => true,
		),
	);
}

function novablocks_get_block_extra_classes( $attributes ) {
	$classes = array();

	if ( ! empty( $attributes['verticalAlignment'] ) ) {
		$classes[] = 'novablocks-u-valign-' . $attributes['verticalAlignment'];
	}

	if ( ! empty( $attributes['horizontalAlignment'] ) ) {
		$classes[] = 'novablocks-u-halign-' . $attributes['horizontalAlignment'];
	}

	if ( ! empty( $attributes['contentPadding'] ) ) {
		$classes[] = 'novablocks-u-spacing-' . $attributes['contentPadding'];
	}

	if ( ! empty( $attributes['contentWidth'] ) ) {
		$classes[] = 'novablocks-u-content-width-' . $attributes['contentWidth'];
	}

	$classes[] = 'novablocks-u-background';
	if ( ! empty( $attributes['overlayFilterStyle'] ) ) {
		$classes[] = 'novablocks-u-background-' . $attributes['overlayFilterStyle'];
	}

	return $classes;
}

function novablocks_get_hero_attributes() {
	$novablocks_block_editor_settings = novablocks_get_block_editor_settings();

	if ( isset( $novablocks_block_editor_settings['hero']['attributes'] ) ) {
		return $novablocks_block_editor_settings['hero']['attributes'];
	}

	return array();
}

function novablocks_get_slideshow_attributes() {
	return array_merge(
		array(
			'galleryImages' => array(
				'type'    => 'array',
				'items'   => array(
					'type' => 'object',
				),
				'default' => array(),
			),
			'slideshowType' => array(
				'type'    => 'string',
				'default' => 'gallery'
			),
			'minHeight'     => array(
				'type'    => 'number',
				'default' => 75,
			),
		),
		novablocks_get_doppler_attributes(),
		novablocks_get_alignment_attributes(),
		novablocks_get_color_attributes(),
		novablocks_get_content_padding_attributes(),
		novablocks_get_content_width_attributes()
	);
}

function novablocks_get_google_map_attributes() {
	return array_merge(
		array(
			'align'        => array(
				'type'    => 'string',
				'default' => 'center',
			),
			'markers'      => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'string',
				),
			),
			'pinColor'     => array(
				'type'    => 'string',
				'default' => '#222222',
			),
			'showControls' => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'showIcons'    => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'showLabels'   => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'styleData'    => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'object'
				),
			),
			'styleSlug'    => array(
				'type'    => 'string',
				'default' => 'original',
			),
			'zoom'         => array(
				'type'    => 'number',
				'default' => 17,
			),
		),
		novablocks_get_doppler_attributes()
	);
}

function novablocks_get_header_attributes() {
	return array(
		'align'  => array(
			'type'    => 'string',
			'default' => 'full',
		),
		'layout' => array(
			'type'    => 'string',
			'default' => 'logo-left',
		),
	);
}

function novablocks_get_media_attributes() {
	$novablocks_block_editor_settings = novablocks_get_block_editor_settings();

	if ( ! empty( $novablocks_block_editor_settings['media']['attributes'] ) ) {
		return $novablocks_block_editor_settings['media']['attributes'];
	}

	return array();
}

function novablocks_get_attributes_with_defaults( $attributes, $attributes_config ) {

	foreach ( $attributes_config as $key => $value ) {

		if ( ! isset( $attributes[ $key ] ) ) {

			if ( isset( $attributes_config[ $key ]['source'] ) && $attributes_config[ $key ]['source'] === 'meta' ) {
				$attributes[ $key ] = get_post_meta( get_the_ID(), $attributes_config[ $key ]['meta'], true );
			} elseif ( isset( $attributes_config[ $key ]['default'] ) ) {
				$attributes[ $key ] = $attributes_config[ $key ]['default'];
			} else {
				// Put some value since some might use it. We should not get here, but do our best if we do.
				$attributes[ $key ] = '';
			}
		}
	}

	return $attributes;
}

function novablocks_get_focal_point_style( $focalPoint ) {
	$focalPointX = intval( $focalPoint['x'] * 10000 ) / 100 . '%';
	$focalPointY = intval( $focalPoint['y'] * 10000 ) / 100 . '%';

	return 'object-position: ' . $focalPointX . ' ' . $focalPointY . ';';
}

function novablocks_add_hero_settings( $settings ) {

	$hero_settings = array(
		'template'   => array(
			array(
				'core/heading',
				array(
					'content' => esc_html__( 'This is a catchy title', '__plugin_txtd' ),
					'align'   => 'center',
					'level'   => 1,
				),
			),
			array(
				'core/paragraph',
				array(
					'content' => esc_html__( 'A brilliant subtitle to explain its catchiness', '__plugin_txtd' ),
					'align'   => 'center',
				),
			),
			array(
				'core/button',
				array(
					'text'  => esc_html__( 'Discover more', '__plugin_txtd' ),
					'align' => 'center',
				),
			),
		),
		'attributes' => array_merge(
			array(
				'anchor'         => array(
					'type'    => 'string',
					'default' => null,
				),
				'backgroundType' => array(
					'type'    => 'string',
					'default' => 'image'
				),
				'media'          => array(
					'type'    => 'object',
					'default' => array(
						'type'  => 'image',
						'sizes' => array(
							'full' => array(
								'url' => 'https://images.unsplash.com/photo-1549631998-6d554b1402ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80',
							),
						),
					),
				),
			),
			novablocks_get_doppler_attributes(),
			novablocks_get_alignment_attributes(),
			novablocks_get_color_attributes(),
			novablocks_get_content_padding_attributes(),
			novablocks_get_content_width_attributes()
		),
	);

	$hero_settings['attributes'] = array_merge( $hero_settings['attributes'], array(
		'minHeightFallback' => array(
			'type'    => 'number',
			'default' => 100,
		),
	) );

	if ( defined( 'NOVABLOCKS_USE_POST_META_ATTRIBUTES' ) && NOVABLOCKS_USE_POST_META_ATTRIBUTES ) {
		$hero_settings['attributes'] = array_merge( $hero_settings['attributes'], array(
			'scrollIndicator'    => array(
				'type'    => 'boolean',
				'source'  => 'meta',
				'meta'    => 'novablocks_hero_scroll_indicator',
				'default' => false,
			),
			'positionIndicators' => array(
				'type'    => 'boolean',
				'source'  => 'meta',
				'meta'    => 'novablocks_hero_position_indicators',
				'default' => true,
			),
		) );
	}

	$settings['hero'] = $hero_settings;

	return $settings;
}

add_filter( 'novablocks_block_editor_initial_settings', 'novablocks_add_hero_settings', 0 );

function novablocks_add_media_settings( $settings ) {

	$media_settings = array(
		'attributes'         => array_merge(
			array(
				'mediaPosition'       => array(
					'type'    => 'string',
					'default' => 'left',
				),
				'blockStyle'          => array(
					'type'    => 'string',
					'default' => 'basic'
				),
				'contentStyle'        => array(
					'type'    => 'string',
					'default' => 'basic',
				),
				'horizontalAlignment' => array(
					'type'    => 'string',
					'default' => 'left',
				),
			),
			novablocks_get_advanced_gallery_attributes()
		),
		'template'           => array(
			array(
				'core/heading',
				array(
					'content' => esc_html__( 'Shoot for the moon, Even if You Miss it', '__plugin_txtd' ),
					'level'   => 4,
				),
			),
			array(
				'core/heading',
				array(
					'content' => esc_html__( 'Welcome to our planet, look and feel matters!', '__plugin_txtd' ),
					'level'   => 2,
				),
			),
			array(
				'core/paragraph',
				array(
					'content' => esc_html__( "We've always defined ourselves by the ability to overcome the impossible. And we count these moments. These moments when we dare to aim higher, to break barriers, to reach for the stars, to make the unknown known.", '__plugin_txtd' ),
				),
			),
			array(
				'core/button',
				array(
					'text' => esc_html__( 'Discover More', '__plugin_txtd' ),
				),
			),
		),
		'contentAreaOptions' => array(
			array(
				'label' => esc_html__( 'Basic', '__plugin_txtd' ),
				'value' => 'basic',
			),
			array(
				'label' => esc_html__( 'Moderate', '__plugin_txtd' ),
				'value' => 'moderate',
			),
			array(
				'label' => esc_html__( 'Highlighted', '__plugin_txtd' ),
				'value' => 'highlighted',
			),
		),
		'blockAreaOptions'   => array(
			array(
				'label' => esc_html__( 'Basic', '__plugin_txtd' ),
				'value' => 'basic',
			),
			array(
				'label' => esc_html__( 'Moderate', '__plugin_txtd' ),
				'value' => 'moderate',
			),
			array(
				'label' => esc_html__( 'Highlighted', '__plugin_txtd' ),
				'value' => 'highlighted',
			),
		)
	);

	$settings['media'] = $media_settings;

	return $settings;
}

add_filter( 'novablocks_block_editor_initial_settings', 'novablocks_add_media_settings', 0 );

function novablocks_add_slideshow_settings( $settings ) {

	$slideshow_settings = array(
		'defaultImages'    => array(
			array(
				'url'   => 'https://source.unsplash.com/_nqApgG-QrY/1600x900',
				'id'    => - 1,
				'sizes' => array(
					'thumbnail' => array(
						'url' => 'https://source.unsplash.com/_nqApgG-QrY/150x150',
					),
					'large'     => array(
						'url'    => 'https://source.unsplash.com/_nqApgG-QrY/1600x900',
						"width"  => 1600,
						"height" => 900
					),
				),
			),
			array(
				'url'     => 'https://source.unsplash.com/Gt_4iMB7hY0/1600x900',
				'title'   => array(
					'rendered' => esc_html__( 'This is a catchy image title', '__plugin_txtd' ),
				),
				'caption' => esc_html__( 'A brilliant caption to explain its catchiness', '__plugin_txtd' ),
				'id'      => - 2,
				'sizes'   => array(
					'thumbnail' => array(
						'url' => 'https://source.unsplash.com/Gt_4iMB7hY0/150x150',
					),
					'large'     => array(
						'url'    => 'https://source.unsplash.com/Gt_4iMB7hY0/1600x900',
						'width'  => 1600,
						'height' => 900,
					),
				),
			),
			array(
				'url'   => 'https://source.unsplash.com/1vKTnwLMdqs/1600x900',
				'id'    => - 3,
				'sizes' => array(
					'thumbnail' => array(
						'url' => 'https://source.unsplash.com/1vKTnwLMdqs/150x150',
					),
					'large'     => array(
						'url'    => 'https://source.unsplash.com/1vKTnwLMdqs/1600x900',
						'width'  => 1600,
						'height' => 900,
					),
				),
			),
		),
		'minHeightOptions' => array(
			array(
				'label' => esc_html__( 'Auto', '__plugin_txtd' ),
				'value' => 0,
			),
			array(
				'label' => esc_html__( 'Half', '__plugin_txtd' ),
				'value' => 50,
			),
			array(
				'label' => esc_html__( 'Two Thirds', '__plugin_txtd' ),
				'value' => 66,
			),
			array(
				'label' => esc_html__( 'Three Quarters', '__plugin_txtd' ),
				'value' => 75,
			),
			array(
				'label' => esc_html__( 'Full Height', '__plugin_txtd' ),
				'value' => 100,
			),
		),
	);

	$settings['slideshow'] = $slideshow_settings;

	return $settings;
}

add_filter( 'novablocks_block_editor_initial_settings', 'novablocks_add_slideshow_settings', 0 );

function novablocks_add_separator_settings( $settings ) {
	$separator_settings = array(
		'markup' => '<hr />'
	);

	$settings['separator'] = $separator_settings;

	return $settings;
}

add_filter( 'novablocks_block_editor_initial_settings', 'novablocks_add_separator_settings', 0 );

function novablocks_get_block_editor_settings() {

	$settings = array(
		'usePostMetaAttributes'        => defined( 'NOVABLOCKS_USE_POST_META_ATTRIBUTES' ) && NOVABLOCKS_USE_POST_META_ATTRIBUTES,
		'minimumHeightOptions'         => array(
			array(
				'label' => esc_html__( 'Half', '__plugin_txtd' ),
				'value' => 50,
			),
			array(
				'label' => esc_html__( 'Two Thirds', '__plugin_txtd' ),
				'value' => 66,
			),
			array(
				'label' => esc_html__( 'Three Quarters', '__plugin_txtd' ),
				'value' => 75,
			),
			array(
				'label' => esc_html__( 'Full', '__plugin_txtd' ),
				'value' => 100,
			),
		),
		'contentPaddingOptions'        => array(
			array(
				'label' => esc_html__( 'Small', '__plugin_txtd' ),
				'value' => 'small',
			),
			array(
				'label' => esc_html__( 'Medium', '__plugin_txtd' ),
				'value' => 'medium',
			),
			array(
				'label' => esc_html__( 'Large', '__plugin_txtd' ),
				'value' => 'large',
			),
			array(
				'label' => esc_html__( 'Custom', '__plugin_txtd' ),
				'value' => 'custom',
			),
		),
		'contentWidthOptions'          => array(
			array(
				'label' => esc_html__( 'Full', '__plugin_txtd' ),
				'value' => 'full',
			),
			array(
				'label' => esc_html__( 'Large', '__plugin_txtd' ),
				'value' => 'large',
			),
			array(
				'label' => esc_html__( 'Narrow', '__plugin_txtd' ),
				'value' => 'narrow',
			),
			array(
				'label' => esc_html__( 'Custom', '__plugin_txtd' ),
				'value' => 'custom',
			),
		),
		'motionPresetOptions'          => array(
			array(
				'label'  => 'Standard Dynamic',
				'value'  => 'standard-dynamic',
				'preset' => array(
					'focalPoint'             => array(
						'x' => 0.5,
						'y' => 0
					),
					'finalFocalPoint'        => array(
						'x' => 0.5,
						'y' => 1
					),
					'initialBackgroundScale' => 1.75,
					'finalBackgroundScale'   => 1,
					'followThroughStart'     => true,
					'followThroughEnd'       => true,
				),
			),
			array(
				'label'  => 'Pull Focus',
				'value'  => 'pull-focus',
				'preset' => array(
					'focalPoint'             => array(
						'x' => 0.5,
						'y' => 0.5
					),
					'finalFocalPoint'        => array(
						'x' => 0.5,
						'y' => 1
					),
					'initialBackgroundScale' => 1,
					'finalBackgroundScale'   => 1.75,
					'followThroughStart'     => true,
					'followThroughEnd'       => true,
				),
			),
			array(
				'label'  => 'Static Reveal',
				'value'  => 'static-reveal',
				'preset' => array(
					'focalPoint'             => array(
						'x' => 0.5,
						'y' => 0.5
					),
					'finalFocalPoint'        => array(
						'x' => 0.5,
						'y' => 0.5
					),
					'initialBackgroundScale' => 1.75,
					'finalBackgroundScale'   => 1,
					'followThroughStart'     => true,
					'followThroughEnd'       => true,
				),
			),
			array(
				'label' => 'Custom',
				'value' => 'custom',
			),
		),
		'advancedGalleryPresetOptions' => novablocks_get_advanced_gallery_presets(),
		'theme_support'                => novablocks_get_theme_support(),
	);

	$settings = apply_filters( 'novablocks_block_editor_initial_settings', $settings );
	$settings = apply_filters( 'novablocks_block_editor_settings', $settings );

	return $settings;
}

function novablocks_get_advanced_gallery_presets() {
	return array(
		array(
			'label'  => 'Clean',
			'value'  => 'clean',
			'preset' => array(
				'sizeContrast'  => 0,
				'positionShift' => 0,
				'imageRotation' => 0,
			),
		),
		array(
			'label'  => 'Overlap',
			'value'  => 'overlap',
			'preset' => array(
				'sizeContrast'  => 0,
				'positionShift' => 5,
				'imageRotation' => 0,
			),
		),
		array(
			'label'  => 'Messy',
			'value'  => 'messy',
			'preset' => array(
				'sizeContrast'  => 1,
				'positionShift' => 15,
				'imageRotation' => 5,
			),
		),
		array(
			'label'  => 'Creative',
			'value'  => 'creative',
			'preset' => array(
				'sizeContrast'  => 3,
				'positionShift' => 14,
				'imageRotation' => 0,
			),
		),
		array(
			'label'  => 'Sparse',
			'value'  => 'sparse',
			'preset' => array(
				'sizeContrast'  => 5,
				'positionShift' => 20,
				'imageRotation' => 0,
			),
		),
		array(
			'label' => 'Custom',
			'value' => 'custom',
		),
	);
}

function novablocks_add_scrolling_effect_options( $settings ) {

	$options = array(
		array(
			'label' => esc_html__( 'Static', '__plugin_txtd' ),
			'value' => 'static'
		),
		array(
			'label' => esc_html__( 'Parallax', '__plugin_txtd' ),
			'value' => 'parallax'
		),
	);

	$settings = array_merge( $settings, array(
		'scrollingEffectOptions' => $options,
	) );

	return $settings;
}

add_filter( 'novablocks_block_editor_initial_settings', 'novablocks_add_scrolling_effect_options' );

function novablocks_get_theme_support() {
	$theme_support = get_theme_support( 'novablocks' );
	$theme_support = is_array( $theme_support ) ? $theme_support[0] : false;

	$default = array(
		'hero',
		'media',
		'slideshow',
	);

	if ( is_array( $theme_support ) ) {
		$theme_support = array_unique( array_merge( $default, $theme_support ), SORT_REGULAR );
	} else {
		$theme_support = $default;
	}

	return $theme_support;
}

function novablocks_render_advanced_gallery( $attributes ) {

	$images = $attributes['images'];

	$advanced_gallery_attributes = array(
		'sizeContrast',
		'positionShift',
		'elementsDistance',
		'positionVariation',
		'imageResizing',
		'objectPosition',
		'containerHeight',
		'imageRotation',
		'verticalSpacing',
	);

	$data_attributes = array();

	foreach ( $advanced_gallery_attributes as $attribute ) {
		if ( empty( $attributes[ $attribute ] ) ) {
			$attributes[ $attribute ] = 0;
		}

		$data_attributes[] = 'data-' . $attribute . '="' . $attributes[ $attribute ] . '"';
	}

	if ( ! empty( $images ) && is_array( $images ) ) {

		echo '<div class="novablocks-advanced-gallery" ' . join( ' ', $data_attributes ) . '>';
		echo '<div class="novablocks-advanced-gallery__grid">';

		foreach ( $images as $image ) {

			if ( is_string( $image ) ) {
				$image = json_decode( $image );
			}

			if ( ! empty( $image ) ) {
				$image = ( array ) $image;
			}

			$url        = $image['url'];
			$attachment = wp_get_attachment_image_src( $image['id'], 'large' );

			// fallback for import
			if ( ! empty( $attachment ) ) {
				$url = $attachment[0];
			}

			if ( ! empty( $url ) ) {
				echo '<div class="novablocks-advanced-gallery__grid-item">';
				echo '<img class="novablocks-advanced-gallery__image" src="' . $url . '" />';
				echo '</div>';
			}
		}

		echo '</div>';
		echo '</div>';

	}
}
