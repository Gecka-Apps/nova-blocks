const {
	Component
} = wp.element;

// Take in a component as argument WrappedComponent
const withPreview = function( WrappedComponent ) {

	// And return a new anonymous component
	return class extends Component {

		constructor() {
			super( ...arguments );

			this.state = {
				preview: {}
			}
		}

		updatePreview( attributes ) {
			this.setState( { preview: attributes } );
		}

		render() {
			const extraProps = {
				updatePreview: this.updatePreview.bind( this ),
				preview: this.state.preview
			}

			return (
				<WrappedComponent
					{ ...this.props }
					{ ...extraProps }
				/>
			)
		}
	}
}

export default withPreview;
