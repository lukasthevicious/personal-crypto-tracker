import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../index";

//File potřebný pro typování Redux + Thunk actions - dle oficiální dokumentace Redux + TS

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => (dispatch: any) => Promise<void> =
  useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;