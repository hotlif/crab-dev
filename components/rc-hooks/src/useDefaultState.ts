import {
	useState as useReactState
} from "react";


interface DefaultStateParam<T> {
	value?: T
	onChange?: (newValue: T) => void
}

export const useDefaultState = <T>(param: DefaultStateParam<T>): {
	value?: T,
	onChange: (newValue: T) => void
} => {
	const [value, setValue] = useReactState<T | undefined>(param?.value);
	
	const getValue = () => {
		if(param?.value != null) {
			return param?.value;
		} else {
			return value;
		}
	}
	
	const getChangeFun = () => {
		if (param.onChange != null) {
			return param.onChange;
		} else {
			return setValue;
		}
	} 

	return {
		value: getValue(),
		onChange: getChangeFun(),
	};
}


