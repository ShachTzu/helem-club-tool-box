import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

describe('MockProvider', () => {
  it('should render children', () => {
    const { container } = render(
      <MockProvider>
        <div className="mock-provider-child">hello world</div>
      </MockProvider>
    );

    const child = container.querySelector('.mock-provider-child');
    expect(child).toBeTruthy();
    expect(child?.textContent).toBe('hello world');
  });

  it('should render a link that resolves to the expected href', () => {
    const { container } = render(
      <MockProvider>
        <a className="mock-provider-link" href="/domains">
          domains
        </a>
      </MockProvider>
    );

    const link = container.querySelector('.mock-provider-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/domains');
  });

  it('should render children when noTheme, noRouter and noApollo are set', () => {
    const { container } = render(
      <MockProvider noTheme noRouter noApollo>
        <div className="mock-provider-plain">plain children</div>
      </MockProvider>
    );

    const child = container.querySelector('.mock-provider-plain');
    expect(child).toBeTruthy();
  });

  it('should report the mock context as true via useIsMock', () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <MockProvider>{children}</MockProvider>
    );

    const { result } = renderHook(() => useIsMock(), { wrapper });

    expect(result.current).toBe(true);
  });
});
