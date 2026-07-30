import { Label } from './label.js';
import { mockLabel, mockLabels } from './label.mock.js';

it('has a Label.from() method', () => {
  expect(Label.from).toBeTruthy();
});

it('should create a Label instance from a plain object', () => {
  const label = Label.from({
    id: 'label-first-aid',
    slug: 'first-aid',
    name: 'עזרה ראשונה',
    description: 'כלים מיידיים לרגעי הצפה, חרדה ומשבר.',
    coverImage: 'https://example.com/cover.png',
    recordCount: 12,
  });

  expect(label).toBeInstanceOf(Label);
  expect(label.id).toEqual('label-first-aid');
  expect(label.slug).toEqual('first-aid');
  expect(label.name).toEqual('עזרה ראשונה');
  expect(label.recordCount).toEqual(12);
});

it('should default recordCount to 0 when missing', () => {
  const label = Label.from({
    id: 'label-empty',
    slug: 'empty',
    name: 'ריק',
  } as any);

  expect(label.recordCount).toEqual(0);
});

it('should serialize a Label into a plain object with toObject()', () => {
  const label = Label.from({
    id: 'label-after',
    slug: 'after',
    name: 'אפטר',
    description: 'סדרת שיחות על החיים שאחרי.',
    coverImage: 'https://example.com/after.png',
    recordCount: 18,
  });

  const plainLabel = label.toObject();

  expect(plainLabel).toEqual({
    id: 'label-after',
    slug: 'after',
    name: 'אפטר',
    description: 'סדרת שיחות על החיים שאחרי.',
    coverImage: 'https://example.com/after.png',
    recordCount: 18,
  });
});

it('should return an id in toObject()', () => {
  const label = mockLabel();
  expect(label.toObject().id).toEqual(label.id);
});

it('mockLabels() should return the 5 seed labels', () => {
  const labels = mockLabels();
  expect(labels).toHaveLength(5);
  labels.forEach((label) => expect(label).toBeInstanceOf(Label));
});

it('mockLabels() should support partial overrides by index', () => {
  const labels = mockLabels([{ name: 'שם חדש' }]);
  expect(labels[0].name).toEqual('שם חדש');
  expect(labels[0].slug).toEqual('first-aid');
});

it('mockLabel() should support overriding properties', () => {
  const label = mockLabel({ name: 'תווית מותאמת', recordCount: 3 });
  expect(label.name).toEqual('תווית מותאמת');
  expect(label.recordCount).toEqual(3);
});
