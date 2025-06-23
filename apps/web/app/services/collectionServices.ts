import { API_URL } from "../../lib/api";
import { CollectionDto } from "../types/collection.dto";

export async function getCollections(){
    const response = await fetch(`${API_URL}/collections`, {
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function createCollection(collection: CollectionDto){
    const response = await fetch(`${API_URL}/collections`, {
        method:'POST',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection)
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function getCollection(collectionId: number){
    const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method:'GET',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function deleteCollection(collectionId: number){
    const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method:'DELETE',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function addProductsToCollection(collectionId: number, productIds: number[]){
    const response = await fetch(`${API_URL}/collections/${collectionId}/ajouterProduits`, {
        method:'POST',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds })
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function updateProducts(collectionId: number, productIds: number[]){
    const response = await fetch(`${API_URL}/collections/${collectionId}/remplacerProduits`, {
        method:'PUT',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds })
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function updateCollection(collectionId: number, collection: CollectionDto){
    const response = await fetch(`${API_URL}/collections/${collectionId}`, {
        method:'PUT',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(collection)
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}

export async function getProductsFromCollection(collectionId: number){
    const response = await fetch(`${API_URL}/collections/${collectionId}/produits`, {
        method:'GET',
        credentials:"include",
        headers:{
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.message || 'erreur de connexion');
    }

    return data;
}
