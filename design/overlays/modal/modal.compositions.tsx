import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Modal } from './modal.js';

export const BasicModal = () => {
  const [open, setOpen] = useState(true);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <button onClick={() => setOpen(true)}>פתיחת חלון</button>
          <Modal open={open} onClose={() => setOpen(false)} title="אישור פעולה">
            <p>האם אתם בטוחים שברצונכם להמשיך בפעולה זו? לא ניתן לשחזר לאחר האישור.</p>
          </Modal>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const ModalWithFooterActions = () => {
  const [open, setOpen] = useState(true);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <button onClick={() => setOpen(true)}>מחיקת פריט</button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="מחיקת פריט מהמועדפים"
            size="small"
            footer={
              <>
                <button onClick={() => setOpen(false)}>ביטול</button>
                <button onClick={() => setOpen(false)}>מחיקה</button>
              </>
            }
          >
            <p>הפריט &quot;כלי נשימה מודרך&quot; יוסר מרשימת המועדפים שלכם.</p>
          </Modal>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const LightboxModal = () => {
  const [open, setOpen] = useState(true);

  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32 }}>
          <button onClick={() => setOpen(true)}>צפייה ביצירה</button>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="מעגל של אור"
            size="large"
          >
            <img
              src="https://storage.googleapis.com/bit-generated-images/images/image_abstract_expressive_painting_r_0_1785186182689.png"
              alt="מעגל של אור"
              style={{ width: '100%', borderRadius: 12, display: 'block', marginBottom: 16 }}
            />
            <p>יצירה מתוך גלריית PTSDART, מאת אחת מחברות הקהילה — ביטוי אישי של תקווה והתחדשות.</p>
          </Modal>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
