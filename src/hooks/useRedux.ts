import { useDispatch, useSelector} from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 使用这个自定义 hook 替代 useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 使用这个自定义 hook 替代 useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


//为什么要使用自定义hook代替