import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shadcn/components/ui/popover.tsx';
import { Button } from '@/shadcn/components/ui/button.tsx';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/shadcn/components/ui/command.tsx';
import { cn } from '@/shadcn/lib/utils.ts';
import { Dispatch, SetStateAction, useState } from 'react';

const genders = [
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    },
];

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

export default function CatGenderCombobox({ value, onChange }: IProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'>
                    {value
                        ? genders.find((framework) => framework.value === value)
                              ?.label
                        : 'Select gender...'}
                    <ChevronsUpDown className='opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search bread...' />
                    <CommandList>
                        <CommandEmpty>No gender found.</CommandEmpty>
                        <CommandGroup>
                            {genders.map((gender) => (
                                <CommandItem
                                    key={gender.value}
                                    value={gender.value}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? ''
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}>
                                    {gender.label}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === gender.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
