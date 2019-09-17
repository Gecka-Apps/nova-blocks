import Control from './control';

const { Component } = wp.element;
const { PanelBody } = wp.components;

const Section = ( props ) => {

	const {
		label,
		settings
	} = props;

	return (
		<PanelBody title={ label }>
			{ Object.keys( settings ).map( settingId => {
				const settingConfig = settings[ settingId ];
				return <Control { ...settingConfig } { ...props } key={ settingId } />;
			} ) }
		</PanelBody>
	);
}

export default Section;
