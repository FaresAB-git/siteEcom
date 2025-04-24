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

