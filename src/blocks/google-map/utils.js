import defaultMapCenter from "./default-map-center";
import styles from "./styles";

export const addVisibilityToStyles = function( styles, showLabels, showIcons ) {

	if ( ! showLabels ) {
		styles.unshift( {
			"elementType": "labels.text",
			"stylers": [ { "visibility": "off" } ]
		} )
	}

	if ( ! showIcons ) {
		styles.unshift( {
			"elementType": "labels.icon",
			"stylers": [ { "visibility": "off" } ]
		} )
	}

	return styles;
}

export const compileStyles = function( styleData ) {
	const {
		attributes: {
			showLabels,
			showIcons,
			styleSlug,
		}
	} = this.props;

	const accentColor = getMapAccentColor.call( this );
	const styleDataString = JSON.stringify( styleData ).replace( /%ACCENT_COLOR%/g, accentColor );
	return JSON.parse( styleDataString );
}

export const getMapStyles = function() {
	const { attributes } = this.props;
	const { styleData, styleSlug } = attributes;
	const shouldHaveCustomStyles = styleSlug !== 'original' && styleData.length === 0;
	const selectedStyles = styles.find( style => style.slug === styleSlug );
	const styleDataBySlug = selectedStyles ? selectedStyles.styles : {};
	const mapStyles = shouldHaveCustomStyles && styleDataBySlug || styleData;
	return compileStyles.call( this, mapStyles );
}

export const getMapAccentColor = function() {
	const { settings } = this.props;
	const { colors } = settings;
	const fallbackColor = '#222222';

	if ( colors && colors.length ) {

		const primary = colors.find( color => color.slug === 'sm-color-primary' );
		const secondary = colors.find( color => color.slug === 'sm-color-secondary' );
		const tertiary = colors.find( color => color.slug === 'sm-color-tertiary' );

		if ( primary ) {
			return primary.color;
		}

		if ( secondary ) {
			return secondary.color;
		}

		if ( tertiary ) {
			return tertiary.color;
		}

		return colors[0].color;
	}

	return fallbackColor;
}

export const getCenterFromMarkers = function( markers ) {

	if ( typeof google === "undefined" || typeof google.maps === "undefined" ) {
		return defaultMapCenter;
	}

	const bounds = new google.maps.LatLngBounds();

	// when there is only one marker bounds aren't accurate at great zoom levels
	if ( markers.length === 1 ) {
		const center = JSON.parse( markers[0] );
		return new google.maps.LatLng( center.geometry.location );
	}

	markers.forEach( markerString => {
		const marker = JSON.parse( markerString );

		if ( ! marker.geometry ) {
			return;
		}

		if ( marker.geometry.viewport ) {
			bounds.union( marker.geometry.viewport );
		} else {
			bounds.extend( marker.geometry.location );
		}
	} );

	return bounds.getCenter();
}

export const getMarkersCenter = function() {
	return getCenterFromMarkers( this.props.attributes.markers );
}
