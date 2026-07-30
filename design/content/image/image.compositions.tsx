import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Image } from './image.js';

export const BasicImage = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 420 }}>
          <Image
            src="https://storage.googleapis.com/bit-generated-images/images/image_wide_banner_photo_of_a_peacefu_0_1785186182783.png"
            alt="מפגש קהילתי בטבע בשעת שקיעה"
            aspectRatio="16 / 9"
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const SquareRoundedImage = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 260 }}>
          <Image
            src="https://storage.googleapis.com/bit-generated-images/images/image_warm_portrait_style_illustrati_0_1785186178200.png"
            alt="איור של ידיים מחזיקות נבט צעיר"
            aspectRatio="1 / 1"
            rounded="large"
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const GalleryGrid = () => {
  const items = [
    {
      src: 'https://storage.googleapis.com/bit-generated-images/images/image_a_serene_abstract_watercolor_p_0_1785186182329.png',
      alt: 'ציור אבסטרקטי בגווני ענבר ונייבי',
    },
    {
      src: 'https://storage.googleapis.com/bit-generated-images/images/image_warm_portrait_style_illustrati_0_1785186178200.png',
      alt: 'איור של צמיחה והחלמה',
    },
    {
      src: 'https://storage.googleapis.com/bit-generated-images/images/image_wide_banner_photo_of_a_peacefu_0_1785186182783.png',
      alt: 'מעגל קהילתי בטבע',
    },
  ];

  return (
    <MemoryRouter>
      <HelamTheme>
        <div
          style={{
            padding: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            maxWidth: 720,
          }}
        >
          {items.map((item) => (
            <Image key={item.src} src={item.src} alt={item.alt} aspectRatio="4 / 3" rounded="medium" />
          ))}
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const BrokenImageState = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 320 }}>
          <Image src="https://this-domain-does-not-exist-helam.example/broken.jpg" alt="תמונה שבורה לדוגמה" aspectRatio="4 / 3" />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
