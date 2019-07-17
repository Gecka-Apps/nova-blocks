import {
	AlignmentControls
} from "../../components/alignment-controls";

const { __ } = wp.i18n;

const {
	Component,
	Fragment
} = wp.element;

const {
	InspectorControls
} = wp.blockEditor;

const {
	PanelBody,
	RadioControl
} = wp.components;


class Inspector extends Component {
	constructor ( props ) {
		super( ...arguments );
	}

	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			mediaStyle,
			contentStyle,
			blockStyle,
		} = attributes;

		return (
			<Fragment>
				<InspectorControls>

					{ false && <PanelBody title={ __( 'Media Area', '__plugin_txtd' ) }  initialOpen={ true }>
						<RadioControl
							label = { __( 'Media Style', '__plugin_txtd' ) }
							value = { mediaStyle }
							selected = { mediaStyle }
							options = { [
								{ label: __( 'Well-organized Grid', '__plugin_txtd' ), value: 'simple' },
								{ label: __( 'Overlap Layered Grid', '__plugin_txtd' ), value: 'overlap' }
							] }
							help={ __( 'Automatically crop and scale images to fill the block container.', '__plugin_txtd' ) }
							onChange = { mediaStyle => setAttributes( { mediaStyle } ) }
						/>
					</PanelBody> }

					<PanelBody title={ __('Content Area', '__plugin_txtd') } initialOpen = { true }>
						<RadioControl
							label = { __( 'Emphasis Level', '__plugin_txtd' ) }
							value = { contentStyle }
							selected = { contentStyle }
							options = { [
								{ label: __( 'Basic', '__plugin_txtd' ), value: 'basic' },
								{ label: __( 'Moderate', '__plugin_txtd' ), value: 'moderate' },
								{ label: __( 'Highlighted', '__plugin_txtd' ), value: 'highlighted' }
							] }
							onChange = { contentStyle => setAttributes( { contentStyle } ) }
						/>

						<AlignmentControls { ...this.props } />
					</PanelBody>


					<PanelBody title={ __('Block Area', '__plugin_txtd') } initialOpen = { true }>
						<RadioControl
							label = { __( 'Emphasis Level', '__plugin_txtd' ) }
							value = { blockStyle }
							selected = { blockStyle }
							options = { [
								{ label: __( 'Basic', '__plugin_txtd' ), value: 'basic' },
								{ label: __( 'Moderate', '__plugin_txtd' ), value: 'moderate' },
								{ label: __( 'Highlighted', '__plugin_txtd' ), value: 'highlighted' }
							] }
							onChange = { blockStyle => setAttributes( { blockStyle } ) }
						/>
					</PanelBody>

				</InspectorControls>
			</Fragment>
		);
	}
}

export default Inspector;
