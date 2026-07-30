import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { SubmitArticle } from './submit-article.js';
import { mockDomainOptions } from './submit-article.mock.js';

export const BasicSubmitArticle = () => {
  return (
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} />
    </MockProvider>
  );
};

export const SubmitArticleSuccessState = () => {
  return (
    <MockProvider>
      <SubmitArticle mockDomains={mockDomainOptions()} previewSubmitted />
    </MockProvider>
  );
};

export const SubmitArticleMobileView = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: 380 }}>
        <SubmitArticle mockDomains={mockDomainOptions()} />
      </div>
    </MockProvider>
  );
};
