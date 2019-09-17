import { STORE_NAME } from "./store";
import Section from "./section";
import BlockPreview from './block-preview';
import { withTypeAndStyle } from "./utils";
import * as icons from "../../icons";

const { __ } = wp.i18n;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;
const { Component, Fragment } = wp.element;
const { PanelBody, TabPanel, Button } = wp.components;
const { dispatch, select, withSelect, subscribe } = wp.data;
const { applyFilters } = wp.hooks;

const noop = () => {};

wp.api.loadPromise.done( () => {

	const settings = new wp.api.models.Settings();
	const SETTING_ID = 'novablocks_style_manager_settings';
	const style_tag = document.getElementById( 'novablocks_style_manager_css' );

	subscribe( () => {
		var isSavingPost = select( 'core/editor' ).isSavingPost();
		var isAutosavingPost = select( 'core/editor' ).isAutosavingPost();

		if ( isSavingPost && !isAutosavingPost ) {
			const styleManagerSettings = JSON.stringify( select( STORE_NAME ).getSettings() );
			settings.save( { [ SETTING_ID ]: styleManagerSettings } );
		}
	} );

	const renderOutput = () => {
		const { getSettings } = select( STORE_NAME );
		const styleManagerSettings = getSettings();
		let output = '';

		Object.keys( styleManagerSettings ).map( blockName => {
			const blockStyles = styleManagerSettings[ blockName ];
			Object.keys( blockStyles ).map( blockStyle => {
				const settings = blockStyles[ blockStyle ];
				Object.keys( settings ).map( settingName => {
					const setting = settings[ settingName ];
					output = output + setting.output;
				} );
			} );
		} );

		style_tag.textContent = output;
	}

	subscribe( renderOutput );

	settings.fetch().then( ( data ) => {
		const styleManagerSettings = JSON.parse( data[ SETTING_ID ] );
		dispatch( STORE_NAME ).updateSettings( styleManagerSettings );
	} );
} );

const StyleManagerSidebar = ( props ) => {

	const config = applyFilters( 'novablocks.styleManagerConfig', {} );

	const { blockType, blockStyle } = props;
	const sections = config[ blockType.name ] && config[ blockType.name ][ blockStyle ] || {};

	return (
		<Fragment>
			{ blockType &&
				<PanelBody>
					<BlockPreview { ...props } />
				</PanelBody>
			}
			{ Object.keys( sections ).map( sectionId => {
				const sectionConfig = sections[ sectionId ];
				return <Section { ...sectionConfig } { ...props } key={ sectionId } />
			} ) }
		</Fragment>
	);
}

const StyleManager = withTypeAndStyle( props => {

	const resetSettings = () => {
		wp.data.dispatch( STORE_NAME ).updateSettings( {} );
		wp.data.dispatch( 'core/editor' ).editPost( { novablocks_style_manager_settings: {} } );
	}

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem target="sidebar-name">
				{ __( 'Style Manager' ) }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar name="sidebar-name" title="Style Manager">
				{ props.block ?
					<Fragment>
						<StyleManagerSidebar { ...props } />
						<PanelBody title={ __( 'Reset' ) } initialOpen={ false }>
							<Button className={ 'editor-post-trash' }
								isDefault
								isLarge
								onClick={ resetSettings }>
								{ __( 'Reset Settings' ) }
							</Button>
						</PanelBody>
					</Fragment> :
					<Fragment>
						<PanelBody>
							{ __( 'A block needs to be selected before you can edit any styles' ) }
						</PanelBody>
					</Fragment> }
			</PluginSidebar>
		</Fragment>
	)
} );

registerPlugin( 'novablocks-style-manager', {
	icon: icons.novaFilled,
	render:  StyleManager,
} );
