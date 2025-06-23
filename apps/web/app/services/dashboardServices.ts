import { API_URL } from "../../lib/api";

export async function getVenteSemaineData() {
  const response = await fetch(`${API_URL}/dashboard/venteSemaine`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function getChiffreAfaireSemaine() {
  const response = await fetch(`${API_URL}/dashboard/chiffreAffaireSemaine`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function getPrevisionStock() {
  const response = await fetch(`${API_URL}/dashboard/previsionStock`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function getPrevisionStockSES() {
  const response = await fetch(`${API_URL}/dashboard/previsionStockSES`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function getPrevisionStockDES() {
  const response = await fetch(`${API_URL}/dashboard/previsionStockDES`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function getVenteParCollection() {
  const response = await fetch(`${API_URL}/dashboard/ventesParCollection`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function createCommandTest() {
  const response = await fetch(`${API_URL}/dashboard/genererCommandeTest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}

export async function DelCommandeTest() {
  const response = await fetch(`${API_URL}/dashboard/DelCommandeTest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }

  return data;
}
