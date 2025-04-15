// services/userService.js
export async function login(email: string, password: string) {
    const res = await fetch('http://localhost:8000/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
  
    // Vérifie si la réponse HTTP est une erreur (statut 4xx ou 5xx)
    if (!res.ok) {
      // Si ce n'est pas une réponse 2xx, lance une erreur avec le message du backend
      const errorData = await res.json();
      throw new Error(errorData.message || 'Une erreur est survenue lors de la connexion.');
    }
  
    return res.json(); // Si la réponse est correcte, renvoie le JSON
  }