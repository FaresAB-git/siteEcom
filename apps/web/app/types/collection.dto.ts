

export interface CollectionDto {  
    nom: string;
    description?: string;
    imgPath?: string;
}

export interface CollectionResponseDto {  
    id: number;
    nom: string;
    description: string | null;
    imgPath: string | null;
    createdAt: Date;
}