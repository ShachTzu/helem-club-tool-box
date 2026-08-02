import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * signed, time-limited authorization for the current member to upload one
 * image directly to Cloudinary from the browser.
 */
type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const CREATE_TOOLBOX_UPLOAD_SIGNATURE_MUTATION = gql`
  mutation CreateToolboxUploadSignature {
    createToolboxUploadSignature {
      signature
      timestamp
      apiKey
      cloudName
      folder
    }
  }
`;

/**
 * uploads a single image file to Cloudinary for the signed-in member: fetches
 * a server-signed authorization scoped to the member's own submission folder,
 * then posts the file straight to Cloudinary (the API secret never touches
 * the browser). returns the resulting secure image url.
 */
export function useUploadImage() {
  const [createSignature] = useMutation<{ createToolboxUploadSignature: UploadSignature }>(
    CREATE_TOOLBOX_UPLOAD_SIGNATURE_MUTATION
  );
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
      const auth = result.data?.createToolboxUploadSignature;
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
