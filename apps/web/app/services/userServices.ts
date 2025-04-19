// services/userService.js
export async function loginAdmin(email: string, password: string) {
    const res = await fetch('http://localhost:8000/auth/loginCookie/admin', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
  
    
    if (!res.ok) {
      
      const errorData = await res.json();
      throw new Error(errorData.message || 'Une erreur est survenue lors de la connexion.');
    }
  
    return res.json(); 
  }

// services/userService.js
export async function register(email: string, password: string) {
    const res = await fetch('http://localhost:8000/auth/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
  
    
    if (!res.ok) {
     
      const errorData = await res.json();
      throw new Error(errorData.message || 'Une erreur est survenue lors de la connexion.');
    }
  
    return res.json(); 
  }



