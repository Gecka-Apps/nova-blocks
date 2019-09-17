export function updateSetting( blockName, blockStyle, setting, value, output ) {
	return {
		type: 'UPDATE_SETTING',
		blockName,
		blockStyle,
		setting,
		value,
		output,
	};
}

export function updateSettings( settings ) {
	return {
		type: 'UPDATE_SETTINGS',
		settings,
	};
}
