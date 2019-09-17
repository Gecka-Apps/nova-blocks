const DEFAULT_STATE = {};

export default function( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS':
			return action.settings;
		case 'UPDATE_SETTING':
			const newState = Object.assign( state );

			if ( ! newState[action.blockName] ) {
				newState[action.blockName] = {};
			}

			if ( ! newState[action.blockName][action.blockStyle] ) {
				newState[action.blockName][action.blockStyle] = {};
			}

			newState[action.blockName][action.blockStyle][action.setting] = {
				value: action.value,
				output: action.output,
			}

			return newState;
	}

	return state;
}
