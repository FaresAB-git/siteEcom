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

export async function getPrevisionStockSES(){
    const response = await fetch("http://localhost:8000/dashboard/previsionStockSES",{
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

export async function getPrevisionStockDES(){
    const response = await fetch("http://localhost:8000/dashboard/previsionStockDES",{
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

export async function getVenteParCollection(){
    const response = await fetch("http://localhost:8000/dashboard/ventesParCollection",{
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

export async function createCommandTest(){
    const response = await fetch("http://localhost:8000/dashboard/genererCommandeTest",{
        method:'POST',
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

export async function DelCommandeTest(){
    const response = await fetch("http://localhost:8000/dashboard/DelCommandeTest",{
        method:'POST',
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

