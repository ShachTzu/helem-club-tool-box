import { validateEmbedHtml } from './embed-allowlist.js';

it('accepts a plain YouTube iframe embed', () => {
  const html = '<iframe width="773" height="360" src="https://www.youtube.com/embed/GpndsBhe2mQ?rel=0"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html.trim());
});

it('accepts a Spotify iframe embed', () => {
  const html = '<iframe src="https://open.spotify.com/embed/episode/abc123"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html);
});

it('accepts youtube-nocookie.com', () => {
  const html = '<iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html);
});

it('rejects empty or missing input', () => {
  expect(validateEmbedHtml('')).toBeNull();
  expect(validateEmbedHtml(undefined)).toBeNull();
  expect(validateEmbedHtml(null)).toBeNull();
  expect(validateEmbedHtml('   ')).toBeNull();
});

it('rejects a script tag', () => {
  expect(validateEmbedHtml('<script>alert(1)</script>')).toBeNull();
});

it('rejects an iframe with an inline event handler', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com/embed/x" onload="alert(1)"></iframe>')).toBeNull();
});

it('rejects an iframe using srcdoc instead of src', () => {
  expect(validateEmbedHtml('<iframe srcdoc="<script>alert(1)</script>"></iframe>')).toBeNull();
});

it('rejects a non-allowlisted host', () => {
  expect(validateEmbedHtml('<iframe src="https://evil.com/embed"></iframe>')).toBeNull();
});

it('rejects a lookalike host (youtube.com.evil.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com.evil.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a lookalike host as a path, not a hostname (evil.com/youtube.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://evil.com/youtube.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a non-https protocol', () => {
  expect(validateEmbedHtml('<iframe src="http://www.youtube.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a data: URI src', () => {
  expect(validateEmbedHtml('<iframe src="data:text/html,<script>alert(1)</script>"></iframe>')).toBeNull();
});

it('rejects a javascript: URI src', () => {
  expect(validateEmbedHtml('<iframe src="javascript:alert(1)"></iframe>')).toBeNull();
});

it('rejects userinfo tricks in the src (https://youtube.com@evil.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com@evil.com/embed/x"></iframe>')).toBeNull();
});

it('rejects more than one iframe', () => {
  const html =
    '<iframe src="https://www.youtube.com/embed/a"></iframe><iframe src="https://www.youtube.com/embed/b"></iframe>';
  expect(validateEmbedHtml(html)).toBeNull();
});

it('rejects an iframe followed by trailing markup', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com/embed/x"></iframe><script>alert(1)</script>')).toBeNull();
});

it('rejects an iframe with no src at all', () => {
  expect(validateEmbedHtml('<iframe width="100"></iframe>')).toBeNull();
});
