/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	Fragment,
} = wp.element;

const {
	InspectorControls,
} = wp.blockEditor;

const {
	PanelBody,
	RadioControl,
	RangeControl,
} = wp.components;

const MediaInspectorControls = function( props ) {
	const {
		attributes: {
			contentStyle,
			blockStyle,
			proportions,
			gridGap,
			rotate,
			scale,
			offset,
		},
		setAttributes,
		settings: {
			media: {
				contentAreaOptions,
				blockAreaOptions,
			},
		},
	} = props;

	return (
		<Fragment>
			<InspectorControls>

				<PanelBody title={ __( 'Cool Stuff', '__plugin_txtd' ) } initialOpen={ true }>

					<RangeControl
						label={ __( 'Grid?' ) }
						value={ proportions }
						onChange={ proportions => setAttributes( { proportions } ) }
						min={ 0 }
						max={ 100 }
					/>

					<RangeControl
						label={ __( 'Scale?' ) }
						value={ scale }
						onChange={ scale => setAttributes( { scale } ) }
						min={ 0 }
						max={ 100 }
					/>

					<RangeControl
						label={ __( 'Offset?' ) }
						value={ offset }
						onChange={ offset => setAttributes( { offset } ) }
						min={ 0 }
						max={ 100 }
					/>

					<RangeControl
						label={ __( 'Grid gap?' ) }
						value={ gridGap }
						onChange={ gridGap => setAttributes( { gridGap } ) }
						min={ 0 }
						max={ 100 }
						step={ 5 }
					/>

					<RangeControl
						label={ __( 'Rotate?' ) }
						value={ rotate }
						onChange={ rotate => setAttributes( { rotate } ) }
						min={ 0 }
						max={ 100 }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Content Area', '__plugin_txtd' ) } initialOpen={ true }>
					<RadioControl
						label={ __( 'Emphasis Level', '__plugin_txtd' ) }
						value={ contentStyle }
						selected={ contentStyle }
						options={ contentAreaOptions }
						onChange={ ( nextContentStyle ) => setAttributes( { contentStyle: nextContentStyle } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Block Area', '__plugin_txtd' ) } initialOpen={ true }>
					<RadioControl
						label={ __( 'Emphasis Level', '__plugin_txtd' ) }
						value={ blockStyle }
						selected={ blockStyle }
						options={ blockAreaOptions }
						onChange={ ( nextBlockStyle ) => setAttributes( { blockStyle: nextBlockStyle } ) }
					/>
				</PanelBody>

			</InspectorControls>
		</Fragment>
	);
};

export default MediaInspectorControls;
