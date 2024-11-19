import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import languageSlice from './features/language/languageSlice';

export const store = configureStore({
    reducer: {
        counterReducer: counterReducer,
        languageReducer: languageSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
