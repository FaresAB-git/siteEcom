import { ProdDto } from "../types/product.dto";
import { ProductResponseDto } from "../types/productResponse.dto";
import { API_URL } from "../../lib/api";

export async function createProduct(product: ProdDto, imageFile: File | null) {
  if (!imageFile) throw new Error("Image manquante pour la création du produit.");

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'votre_upload_preset');

  const uploadRes = await fetch(`${API_URL}/produit`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
  }

  const uploadData = await uploadRes.json();
  const imageUrl = uploadData.url;

  const productWithImage = { ...product, imgPath: imageUrl };

  const res = await fetch(`${API_URL}/produit`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productWithImage),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur lors de la création du produit');
  }

  return res.json();
}

export async function getProducts(): Promise<ProductResponseDto[]> {
  const response = await fetch(`${API_URL}/produit`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }
  return data;
}

export async function getProduct(idProduct: number): Promise<ProductResponseDto> {
  const response = await fetch(`${API_URL}/produit/${idProduct}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }
  return data;
}

export async function updateProduct(id: number, product: ProdDto, imageFile: File | null) {
  let imageUrl = product.imgPath;

  if (imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'votre_upload_preset');

    const uploadRes = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(error.message || 'Erreur lors de l\'upload de la nouvelle image');
    }

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.url;
  }

  const updatedProduct = { ...product, imgPath: imageUrl };

  const res = await fetch(`${API_URL}/produit/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour du produit');
  }

  return res.json();
}

export async function uploadImg(imgFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', imgFile);

  const uploadRes = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const error = await uploadRes.json();
    throw new Error(error.message || 'Erreur lors de l\'upload de la nouvelle image');
  }

  const uploadData = await uploadRes.json();
  const imageUrl = uploadData.url;

  return imageUrl;
}

export async function getNewProducts(): Promise<ProductResponseDto[]> {
  const response = await fetch(`${API_URL}/produit/newProducts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'erreur de connexion');
  }
  return data;
}
