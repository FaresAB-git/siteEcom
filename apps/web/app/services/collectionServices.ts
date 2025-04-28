import { json } from "stream/consumers";
import { CollectionDto } from "../types/collection.dto";

export async function getCollections(){
    const response = await fetch("http://localhost:8000/collections",{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}


export async function createCollection(collection: CollectionDto){
    const response = await fetch("http://localhost:8000/collections",{
        method:'POST',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection)
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}

