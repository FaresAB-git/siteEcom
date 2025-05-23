export async function getVenteSemaineData(){
    const response = await fetch("http://localhost:8000/dashboard/venteSemaine",{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    console.log(data);
    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}

export async function getChiffreAfaireSemaine(){
    const response = await fetch("http://localhost:8000/dashboard/chiffreAffaireSemaine",{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    console.log(data);
    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}

export async function getPrevisionStock(){
    const response = await fetch("http://localhost:8000/dashboard/previsionStock",{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    console.log(data);
    if(!response.ok){
        throw new Error (data.message || 'erreur de connexion');
    }

    return data
}

