const {
	Component,
	createContext
} = wp.element;

const {
	createHigherOrderComponent
} = wp.compose;

const { Consumer, Provider } = createContext( {
	name: '',
	isSelected: false,
	focusedElement: null,
	setFocusedElement: () => {},
	clientId: null,
} );

const withHoverPreview = () => createHigherOrderComponent( ( OriginalComponent ) => {
	return ( props ) => (
		<Consumer>
			{ ( context ) => {
				return <OriginalComponent
					{ ...props }
				/>
			} }
		</Consumer>
	)
}, 'withHoverPreview' );

export default withHoverPreview;