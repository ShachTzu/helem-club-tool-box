import { App } from './app.js';
import { mockApp, mockApps } from './app.mock.js';

it('has an App.from() method', () => {
  expect(App.from).toBeTruthy();
});

it('should create an App instance from a plain object', () => {
  const app = App.from({
    id: 'app-1',
    slug: 'app-1',
    name: 'Test App',
    subtitle: 'A subtitle',
    fullDescription: 'A full description',
    externalLink: 'https://example.com',
    icon: '🎯',
    costType: 'free',
    language: 'English',
    requiresSignup: false,
    developerName: 'Jane Doe',
  });

  expect(app).toBeInstanceOf(App);
  expect(app.id).toEqual('app-1');
  expect(app.name).toEqual('Test App');
  expect(app.screenshots).toEqual([]);
  expect(app.platform).toEqual([]);
  expect(app.domains).toEqual([]);
  expect(app.clickCount).toEqual(0);
  expect(app.status).toEqual('approved');
});

it('should serialize an App into a plain object with toObject()', () => {
  const app = mockApp();
  const plainApp = app.toObject();

  expect(plainApp.id).toEqual(app.id);
  expect(plainApp.name).toEqual(app.name);
  expect(plainApp.slug).toEqual(app.slug);
  expect(plainApp.avgRating).toEqual(app.avgRating);
});

it('should compute totalHelpfulVotes', () => {
  const app = mockApp({ helpfulYes: 10, helpfulNo: 5 });
  expect(app.totalHelpfulVotes).toEqual(15);
});

it('should allow overriding mock properties', () => {
  const app = mockApp({ name: 'Custom Name' });
  expect(app.name).toEqual('Custom Name');
});

it('should provide a seed catalog of mock apps', () => {
  const apps = mockApps();
  expect(apps.length).toBeGreaterThan(0);
  apps.forEach((app) => {
    expect(app).toBeInstanceOf(App);
  });
});
