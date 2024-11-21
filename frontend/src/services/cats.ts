export async function fetchCats(): Promise<Cat[]> {
    const response = await fetch('http://localhost:3001/api/cats');

    if (!response.ok) {
        throw new Error(`Error fetching cats: ${response.statusText}`);
    }

    return await response.json();
}

export async function createNewCat(cat: Cat): Promise<void> {
    const response = await fetch('http://localhost:3001/api/cats', {
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
