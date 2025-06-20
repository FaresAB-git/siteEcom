type Prevision = {
  ventes7j: number;
  forecastDemandeProchainJour: number;
  joursRestants: number | null;
};

type PrevisionsResponse = {
  id: number;
  nom: string;
  stock: number;
  previsions: {
    croissant: Prevision;
    stable: Prevision;
    decroissant: Prevision;
  };
};
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

export async function getPrevStockMATest(): Promise<PrevisionsResponse>{
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

export async function getPrevStockSESTest(): Promise<PrevisionsResponse>{
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

export async function getPrevStockDESTest(): Promise<PrevisionsResponse>{
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

export async function getVentesProduitTest(){
    const response = await fetch("http://localhost:8000/stock-prev/ventesProduitTest",{
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

