import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { TextInput } from './text-input.js';
import { MailIcon } from './mail-icon.js';
import { PhoneIcon } from './phone-icon.js';

export const BasicTextInput = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 380 }}>
          <TextInput label="שם מלא" placeholder="איך קוראים לך?" />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const TextInputWithIconAndTypes = () => {
  const [email, setEmail] = useState(``);
  const [phone, setPhone] = useState(``);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 380, display: 'grid', gap: 20 }}>
          <TextInput
            label="דוא&quot;ל"
            type="email"
            placeholder="name@example.com"
            icon={<MailIcon />}
            value={email}
            onChange={(value) => setEmail(value)}
            helperText="נשתמש בכתובת הזו רק לעדכונים חשובים"
          />
          <TextInput
            label="טלפון"
            type="tel"
            placeholder="050-0000000"
            icon={<PhoneIcon />}
            value={phone}
            onChange={(value) => setPhone(value)}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const TextInputWithError = () => {
  const [website, setWebsite] = useState(`not-a-url`);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, maxWidth: 380 }}>
          <TextInput
            label="אתר אישי (אופציונלי)"
            type="url"
            placeholder="https://example.com"
            required
            value={website}
            onChange={(value) => setWebsite(value)}
            error={website && !website.startsWith('http') ? `כתובת האתר חייבת להתחיל ב-http:// או https://` : undefined}
          />
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
