export async function createCommandTest(){
    const response = await fetch("http://localhost:8000/stock-prev/genererCommandeTest",{
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

export async function getPrevStockMATest(){
    const response = await fetch("http://localhost:8000/stock-prev/ma",{
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

export async function getPrevStockSESTest(){
    const response = await fetch("http://localhost:8000/stock-prev/SES",{
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

export async function getPrevStockDESTest(){
    const response = await fetch("http://localhost:8000/stock-prev/DES",{
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


