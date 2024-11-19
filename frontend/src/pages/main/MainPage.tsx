import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts';
import { Button } from '@/shadcn/components/ui/button.tsx';
import {
    decrementCounter,
    incrementCounter,
} from '@/store/features/counter/counterSlice.ts';

const MainPage = () => {
    const dispatch = useAppDispatch();

    const count = useAppSelector((state) => state.counterReducer.value);

    function handleOnIncrement() {
        dispatch(incrementCounter());
    }

    function handleOnDecrement() {
        dispatch(decrementCounter());
    }

    return (
        <div>
            <h1 className='mb-8 mt-32 text-4xl font-extrabold tracking-tight'>
                Redux Using
            </h1>
            <div className='grid h-auto grid-cols-12 gap-4'>
                <div className='col-span-12 rounded border border-cyan-600 p-2 lg:col-span-3'>
                    <p>
                        <b>Count is: </b>
                        <i>{count}</i>
                    </p>
                    <Button
                        onClick={handleOnIncrement}
                        variant='outline'
                        className='mt-4'>
                        Increment
                    </Button>
                    <Button
                        onClick={handleOnDecrement}
                        variant='destructive'
                        className='ml-2 mt-4'>
                        Decrement
                    </Button>
                </div>
            </div>

            <h1 className='mb-8 mt-32 text-4xl font-extrabold tracking-tight'>
                Bootstrap like Grid
            </h1>
            <div className='grid h-auto grid-cols-12 gap-4 bg-amber-50'>
                {[...Array(12).keys()].map((el) => {
                    return (
                        <div
                            className='h-32 bg-amber-600 p-2'
                            key={el}>
                            {el + 1}
                        </div>
                    );
                })}
            </div>
            <div className='mt-8 grid h-32 grid-cols-12 gap-x-4 bg-amber-50 text-center'>
                <div className='col-span-1 bg-fuchsia-600 p-2'>1</div>
                <div className='col-span-2 bg-pink-500 p-2'>2</div>
                <div className='col-span-2 col-start-5 bg-pink-300 p-2'>
                    2, start at 5
                </div>
                <div className='col-span-6 bg-green-700 p-2 text-fuchsia-50'>
                    6
                </div>
            </div>
        </div>
    );
};

export default MainPage;
