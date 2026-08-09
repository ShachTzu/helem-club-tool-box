import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * mail-forwarding for the retired knowledge-base scope.
 *
 * Its `/knowledge*` routes no longer exist, but links to them still live
 * elsewhere in the product — notably the community-wisdom feed, which is
 * owned by knowledge-domains and is deliberately out of this feature's
 * scope. Forwarding here, from the scope that absorbed that content, keeps
 * those links working without reaching into a feature this one does not own.
 *
 * Redirects on mount rather than via `<Navigate>`: `<Navigate>` is a no-op
 * during server-side rendering (react-router logs "must not be used on the
 * initial render in a StaticRouter" and renders nothing), which would leave
 * a blank page for anyone whose JS hasn't run yet. This renders a real,
 * readable message server-side and then forwards in the browser.
 */
export function LegacyKnowledgeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/knowledge-library', { replace: true });
  }, [navigate]);

  return (
    <p style={{ padding: '48px 20px', textAlign: 'center' }}>
      מאגר הידע אוחד עם ספריית הידע. מעבירים אתכם...{' '}
      <a href="/knowledge-library">לחצו כאן אם המעבר לא קורה מעצמו</a>
    </p>
  );
}
