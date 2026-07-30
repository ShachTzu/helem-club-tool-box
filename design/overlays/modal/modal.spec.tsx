import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Modal } from './modal.js';
import styles from './modal.module.scss';

function ControlledModal(props: { closeOnBackdropClick?: boolean; closeOnEsc?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="כותרת לדוגמה"
      closeOnBackdropClick={props.closeOnBackdropClick}
      closeOnEsc={props.closeOnEsc}
    >
      <p>תוכן החלון</p>
    </Modal>
  );
}

it('should render the modal title and content when open', () => {
  const { container } = render(
    <MemoryRouter>
      <Modal open onClose={() => {}} title="כותרת לדוגמה">
        <p>תוכן החלון</p>
      </Modal>
    </MemoryRouter>
  );

  const title = container.querySelector(`.${styles.title}`);
  const body = container.querySelector(`.${styles.body}`);

  expect(title?.textContent).toBe('כותרת לדוגמה');
  expect(body?.textContent).toBe('תוכן החלון');
});

it('should not render anything when closed', () => {
  const { container } = render(
    <MemoryRouter>
      <Modal open={false} onClose={() => {}} title="כותרת לדוגמה">
        <p>תוכן החלון</p>
      </Modal>
    </MemoryRouter>
  );

  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeNull();
});

it('should call onClose when the close button is clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <ControlledModal />
    </MemoryRouter>
  );

  const closeButton = container.querySelector(`.${styles.closeButton}`) as HTMLButtonElement;
  fireEvent.click(closeButton);

  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeNull();
});

it('should call onClose when the backdrop is clicked', () => {
  const { container } = render(
    <MemoryRouter>
      <ControlledModal />
    </MemoryRouter>
  );

  const backdrop = container.querySelector(`.${styles.backdrop}`) as HTMLDivElement;
  fireEvent.mouseDown(backdrop);

  const backdropAfter = container.querySelector(`.${styles.backdrop}`);
  expect(backdropAfter).toBeNull();
});

it('should not call onClose when the backdrop is clicked and closeOnBackdropClick is false', () => {
  const { container } = render(
    <MemoryRouter>
      <ControlledModal closeOnBackdropClick={false} />
    </MemoryRouter>
  );

  const backdrop = container.querySelector(`.${styles.backdrop}`) as HTMLDivElement;
  fireEvent.mouseDown(backdrop);

  const backdropAfter = container.querySelector(`.${styles.backdrop}`);
  expect(backdropAfter).not.toBeNull();
});

it('should call onClose when the escape key is pressed', () => {
  const { container } = render(
    <MemoryRouter>
      <ControlledModal />
    </MemoryRouter>
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  const backdrop = container.querySelector(`.${styles.backdrop}`);
  expect(backdrop).toBeNull();
});

it('should render footer content when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Modal open onClose={() => {}} title="כותרת" footer={<button>אישור</button>}>
        <p>תוכן</p>
      </Modal>
    </MemoryRouter>
  );

  const footer = container.querySelector(`.${styles.footer}`);
  expect(footer?.textContent).toBe('אישור');
});
