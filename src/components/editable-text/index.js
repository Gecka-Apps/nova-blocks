const { forwardRef } = wp.element;
const { RichText } = wp.blockEditor;

const EditableText = forwardRef( ( props, ref ) => {
	return <RichText ref={ ref } { ...props } __unstableDisableFormats />;
} );

EditableText.Content = ( { value = '', tagName: Tag = 'div', ...props } ) => {
	return <Tag { ...props }>{ value }</Tag>;
};

/**
 * Renders an editable text input in which text formatting is not allowed.
 */
export default EditableText;
