import "./filters/with-block-id";
import "./filters/with-block-index";
import "./filters/with-font-size-picker";

import "./blocks/core/separator";

import announcementBarBlockInit from "./blocks/announcement-bar";
import googleMapBlockInit from "./blocks/google-map";
import headerBlockInit from "./blocks/header";
import headlineInit from "./blocks/headline";
import heroInit from "./blocks/hero";
import logoInit from "./blocks/logo";
import mediaInit from "./blocks/media";
import slideshowInit from "./blocks/slideshow";
import navigationInit from "./blocks/navigation";
import menuFoodInit from "./blocks/menu-food";
import menuFoodSectionInit from "./blocks/menu-food-section";
import menuFoodItemInit from "./blocks/menu-food-item";
import opentableInit from "./blocks/opentable";

import { STORE_NAME } from './store';

import { nova } from './icons';

import { addSeparatorFilters } from "./blocks/core/separator";

const {
	dispatch,
} = wp.data;

const {
	updateCategory
} = wp.blocks;

class novaBlocks {

	initialize( settings ) {
		addSeparatorFilters( settings );
		dispatch( STORE_NAME ).updateSettings( settings );
		updateCategory( 'nova-blocks', {
			icon: nova
		} );

		const supports = ( typeof settings[ 'theme_support' ] === 'object' ) ? Object.values( settings[ 'theme_support' ] ) : settings[ 'theme_support' ];

		if ( supports.indexOf('announcement-bar') > -1 ) {
			announcementBarBlockInit();
		}

		if ( supports.indexOf('google-map') > -1 ) {
			googleMapBlockInit();
		}

		if ( supports.indexOf('header') > -1 ) {
			headerBlockInit();
			logoInit();
		}

		if ( supports.indexOf('headline') > -1 ) {
			headlineInit();
		}

		// We always register the Hero block.
		heroInit();

		// We always register the Media block.
		mediaInit();

		if ( supports.indexOf('navigation') > -1 ) {
			navigationInit();
		}

		if ( supports.indexOf('menu-food') > -1 ) {
			menuFoodInit();
			menuFoodSectionInit();
			menuFoodItemInit();
		}

		if ( supports.indexOf('opentable') > -1 ) {
			opentableInit();
		}

		if ( supports.indexOf('slideshow') > -1 ) {
			slideshowInit();
		}
	}
}

wp.novaBlocks = new novaBlocks();
