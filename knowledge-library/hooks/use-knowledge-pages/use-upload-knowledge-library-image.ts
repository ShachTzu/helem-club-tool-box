import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * mirrors toolbox/hooks/use-apps/use-upload-image.tsx — same signed-upload
 * flow, this feature's own mutation and folder.
 */
type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const CREATE_KNOWLEDGE_LIBRARY_UPLOAD_SIGNATURE_MUTATION = gql`
  mutation CreateKnowledgeLibraryUploadSignature {
    createKnowledgeLibraryUploadSignature {
      signature
      timestamp
      apiKey
      cloudName
      folder
    }
  }
`;

/**
 * uploads a single image file to Cloudinary for the signed-in editor:
 * fetches a server-signed authorization scoped to their own upload folder,
 * then posts the file straight to Cloudinary (the API secret never touches
 * the browser). returns the resulting secure image url.
 */
export function useUploadKnowledgeLibraryImage() {
  const [createSignature] = useMutation<{
    createKnowledgeLibraryUploadSignature: UploadSignature;
  }>(CREATE_KNOWLEDGE_LIBRARY_UPLOAD_SIGNATURE_MUTATION);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const uploadImage = async (file: File): Promise<string | undefined> => {
    setError(undefined);

    if (!file.type.startsWith('image/')) {
      setError('ניתן להעלות קובצי תמונה בלבד');
      return undefined;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('התמונה גדולה מדי (מקסימום 5MB)');
      return undefined;
    }

    setUploading(true);
    try {
      const result = await createSignature();
      const auth = result.data?.createKnowledgeLibraryUploadSignature;
      if (!auth) {
        setError('אירעה שגיאה בהכנת ההעלאה, נסו שוב');
        return undefined;
      }

      const body = new FormData();
      body.append('file', file);
      body.append('api_key', auth.apiKey);
      body.append('timestamp', String(auth.timestamp));
      body.append('signature', auth.signature);
      body.append('folder', auth.folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${auth.cloudName}/image/upload`, {
        method: 'POST',
        body,
      });
      if (!response.ok) {
        setError('העלאת התמונה נכשלה, נסו שוב');
        return undefined;
      }

      const payload = (await response.json()) as { secure_url?: string };
      if (!payload.secure_url) {
        setError('העלאת התמונה נכשלה, נסו שוב');
        return undefined;
      }
      return payload.secure_url;
    } catch {
      setError('העלאת התמונה נכשלה, נסו שוב');
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const clearError = () => setError(undefined);

  return { uploadImage, uploading, error, clearError };
}
