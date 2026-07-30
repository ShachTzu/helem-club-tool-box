export type ListGalleryItemsOptions = {
  mediaType?: string;
  domainIds?: string[];
  query?: string;
  limit?: number;
};

export type GetGalleryItemOptions = {
  idOrSlug?: string;
};

export type CreateGalleryItemOptions = {
  title: string;
  description?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  artistName?: string;
  domains?: string[];
};

export type UpdateGalleryItemOptions = {
  title?: string;
  description?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  artistName?: string;
  domains?: string[];
};
