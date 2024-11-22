import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts';
import { Button } from '@/shadcn/components/ui/button.tsx';
import {
    decrementCounter,
    incrementCounter,
} from '@/store/features/counter/counterSlice.ts';
import { useForm } from 'react-hook-form';
import { Input } from '@/shadcn/components/ui/input.tsx';
import CatBreedCombobox from '@/pages/main/CatBreedCombobox.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shadcn/components/ui/form.tsx';
import CatGenderCombobox from '@/pages/main/CatGenderCombobox.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Cat, createNewCat, fetchCats } from '@/services/cats.ts';
import { Skeleton } from '@/shadcn/components/ui/skeleton.tsx';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: 'Name of a cat is required',
        })
        .max(100, {
            message: 'Name of a cat should not be more than 100 characters',
        }),
    breed: z.enum([
        'Maine Coon',
        'Ragdoll',
        'British Shorthair',
        'Bengal',
        'Sphynx',
    ]),
    gender: z.enum(['Male', 'Female']),
});

const MainPage = () => {
    const dispatch = useAppDispatch();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const [cats, setCats] = useState<Cat[]>([]);

    const mutation = useMutation({
        mutationFn: createNewCat,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['cats'] });
        },
    });

    const count = useAppSelector((state) => state.counterReducer.value);

    function handleOnIncrement() {
        dispatch(incrementCounter());
    }

    function handleOnDecrement() {
        dispatch(decrementCounter());
    }

    async function onSubmitCreateCat(values: z.infer<typeof formSchema>) {
        console.log(
            `Submitting the form with the data: ${JSON.stringify(values)}`
        );

        await mutation.mutateAsync(values as Cat);
    }

    async function handleFetch(): Promise<void> {
        setLoading(true);

        try {
            const data = await queryClient.fetchQuery({
                queryKey: ['cats'],
                queryFn: fetchCats,
                // staleTime: 20000, // how long values will be cached in ms
                retry: 5, // how many times will query retry if it fails
                // retryDelay: 1,
            });

            setCats(data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='mb-32 grid h-auto grid-cols-12 gap-4'>
                <div className='col-span-12 mb-16 lg:col-span-4'>
                    <h1 className='mb-8 h-16 text-4xl font-extrabold tracking-tight'>
                        React-hook-form example
                    </h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitCreateCat)}
                            className='space-y-8 rounded border border-cyan-600 p-2'>
                            <h3 className='mb-8 text-2xl font-bold text-gray-500'>
                                Create a new Cat
                            </h3>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cat name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Tom'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is a cat name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='breed'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cat breed</FormLabel>
                                        <FormControl>
                                            <div>
                                                <CatBreedCombobox
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            This is a cat breed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='gender'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cat gender</FormLabel>
                                        <FormControl>
                                            <div>
                                                <CatGenderCombobox
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            This is a cat gender.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {mutation.isPending ? (
                                <Button disabled>
                                    <Loader2 className='animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type='submit'>Submit</Button>
                            )}
                        </form>
                    </Form>
                </div>

                <div className='col-span-12 mb-16 lg:col-span-3'>
                    <h1 className='mb-8 h-16 text-4xl font-extrabold tracking-tight'>
                        Redux usage
                    </h1>
                    <div className='rounded border border-cyan-600 p-2'>
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

                <div className='col-span-12 mb-16 lg:col-span-5'>
                    <h1 className='mb-8 h-16 text-4xl font-extrabold tracking-tight'>
                        React Query usage
                    </h1>
                    <div className='rounded border border-cyan-600 p-2'>
                        <Button onClick={handleFetch}>Fetch</Button>
                        {loading ? (
                            <div className='mt-4'>
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                                <Skeleton className='mb-2 h-8 rounded bg-cyan-500' />
                            </div>
                        ) : cats.length > 0 ? (
                            <div className={'mt-4'}>
                                {cats.map((cat) => (
                                    <div
                                        className='mb-2 rounded bg-gray-100 p-1 px-3 text-black'
                                        key={cat.PK}>
                                        {cat.name}, <i>{cat.breed}</i>{' '}
                                        <b>{cat.gender}</b>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h4 className='mt-4 text-lg font-bold'>
                                No cats found.
                            </h4>
                        )}
                    </div>
                </div>
            </div>

            <h1 className='mb-8 mt-32 text-4xl font-extrabold tracking-tight'>
                Bootstrap like Grid
            </h1>
            <div className='grid h-auto grid-cols-12 gap-4 bg-amber-200'>
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
            <div className='mt-8 grid h-32 grid-cols-12 gap-x-4 bg-amber-200 text-center'>
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
