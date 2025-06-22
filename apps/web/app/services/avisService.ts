import { CreateAvis } from "../types/CreateAvis";

export async function createAvis(avis: CreateAvis){
    const response = await fetch("http://localhost:8000/avis",{
        method:'POST',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(avis)
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}