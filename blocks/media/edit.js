import withPreview from "../../components/with-preview";

const { Component, Fragment } = wp.element;

import Controls from './controls';
import Inspector from './inspector';
import MediaPreview from './preview';

class Edit extends Component {

	constructor() {
		super( ...arguments );
	}

	updateImages( media ) {
		this.props.setAttributes({
			images: media.map( ( image ) => JSON.stringify({ id: image.id, url: image.url, alt: image.alt }) )
		});
	}

	render() {

		const props = Object.assign( {}, this.props );
		props.attributes = Object.assign( {}, props.attributes, props.preview );

		const {
			attributes: {
				positionIndicator,
			},
			setAttributes,
		} = this.props;

		return [
			<Fragment>
				<MediaPreview { ...props } updateImages={ this.updateImages.bind( this ) } />
				<Controls { ...this.props } updateImages={ this.updateImages.bind( this ) } />
				<Inspector { ...this.props } />
			</Fragment>
		]
	}
}

export default withPreview( Edit );