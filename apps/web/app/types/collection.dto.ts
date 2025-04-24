

export interface CollectionDto {  
    nom: string;
    description?: string;
}

export interface CollectionResponseDto {  
    id: number;
    nom: string;
    description: string | null;
    createdAt: Date;
}