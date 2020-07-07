//init reducer

export const initialState = [
	{
		id: 0,
		x: 20,
		y: 20,
		width: 150,
		value: 'Header',
		bold: false,
		italic: false,
		underline: false,
		keepfocus: false,
		fontColor: '#000',
		fontSize: '18px',
		align: 'left',
		selected: true
	}
];

export function projectReducer(state, action) {
	switch (action.type) {
		case 'addHeader': {
			return [
				...state,
				{
					id: state.length + 1,
					x: 20,
					y: 20,
					width: 150,
					value: 'Header',
					bold: false,
					italic: false,
					underline: false,
					keepfocus: false,
					fontColor: '#000',
					fontSize: '18px',
					align: 'left',
					selected: true
				}
			];
		}
		case 'addSubheader': {
			return [
				...state,
				{
					id: state.length + 1,
					x: 20,
					y: 20,
					width: 150,
					value: 'Subheader',
					bold: false,
					italic: false,
					underline: false,
					keepfocus: false,
					fontColor: '#000',
					fontSize: '14px',
					selected: true
				}
			];
		}
		case 'addParagraph': {
			return [
				...state,
				{
					id: state.length + 1,
					x: 20,
					y: 20,
					width: 150,
					value:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas imperdiet turpis vel sodales. Ut iaculis orci quis tellus semper iaculis nec et ante.',
					bold: false,
					italic: false,
					underline: false,
					keepfocus: false,
					fontColor: '#000',
					fontSize: '11px',
					selected: true
				}
			];
		}
		case 'delete': {
			let newState = state.filter((el, i) => el.id !== action.payload.i);
			console.log(newState);

			return newState;
		}
		case 'moveTo': {
			console.log(state);
			return {
				...state,
				[action.payload.side]: state[action.payload.side].map((el) => {
					if (el.id === action.payload.i) {
						console.log(el.id);
						console.log(action.payload);
						el.x = action.payload.x;
						el.y = action.payload.y;
						console.log(el);
						return el;
					}
					return el;
				})
			};
		}
		case 'width': {
			return {
				...state,
				[action.payload.side]: state[action.payload.side].map((el) => {
					if (el.id === action.payload.i) {
						el.width = action.payload.width;
						return el;
					}
					return el;
				})
			};
		}
		case 'change': {
			return {
				...state,
				[action.payload.side]: state[action.payload.side].map((el) => {
					if (el.id === action.payload.i) {
						el.value = action.payload.value;
						return el;
					}
					return el;
				})
			};
		}
		case 'toggleSelect': {
			return {
				...state,
				[action.payload.side]: state[action.payload.side].map((el) => {
					if (el.id === action.payload.i) {
						el.selected = action.payload.selected;
						return el;
					}
					return el;
				})
			};
		}
		case 'text': {
			let side = 'front';
			if (!state['front'].some((el) => el.selected === true)) {
				side = 'back';
			}

			return {
				...state,
				[side]: state[side].map((el) => {
					if (el.selected) {
						el[action.payload.name] = !el[action.payload.name];
						return el;
					}
					return el;
				})
			};
		}
		case 'keyval': {
			let side = 'front';
			if (!state['front'].some((el) => el.selected === true)) {
				side = 'back';
			}

			return {
				...state,
				[side]: state[side].map((el) => {
					if (el.selected) {
						el[action.payload.name] = action.payload.value;
						return el;
					}
					return el;
				})
			};
		}
		case 'load': {
			return action.payload.state;
		}
		default:
			return state;
	}
}
