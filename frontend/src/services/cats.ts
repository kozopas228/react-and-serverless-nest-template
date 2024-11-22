const prefix = 'api/cats';

export async function fetchCats(): Promise<Cat[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${prefix}`);

    if (!response.ok) {
        throw new Error(`Error fetching cats: ${response.statusText}`);
    }

    return await response.json();
}

export async function createNewCat(cat: Cat): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${prefix}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
    });

    return await response.json();
}

export interface Cat {
    PK: string;
    SK: string;
    name: string;
    gender: 'Male' | 'Female';
    breed: 'Maine Coon' | 'Ragdoll' | 'British Shorthair' | 'Bengal' | 'Sphynx';
}
