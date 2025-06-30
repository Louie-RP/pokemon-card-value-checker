export async function fetchSets() {
    const res = await fetch('http://localhost:4000/api/sets');
    if (!res.ok) throw new Error('Failed to fetch sets');
    return res.json();
}