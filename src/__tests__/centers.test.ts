import { describe, expect, it } from 'vitest';
import { getCentersByRegion, getHighSupportContacts, regionOptions, supportCenters } from '../data/centers';

describe('regional support center data', () => {
  it('has at least one sourced center for every supported region filter', () => {
    for (const region of regionOptions) {
      const centers = getCentersByRegion(region.key);
      expect(centers.length, `${region.label} should not be empty`).toBeGreaterThan(0);
    }
  });

  it('uses the required sourced schema for every center', () => {
    for (const center of supportCenters) {
      expect(center.id).toBeTruthy();
      expect(center.regionKey).toBeTruthy();
      expect(center.name).toBeTruthy();
      expect(center.type).toBeTruthy();
      expect(center.phone).toBeTruthy();
      expect(center.address).toBeTruthy();
      expect(center.services.length).toBeGreaterThan(0);
      expect(center.sourceLabel).toBeTruthy();
      expect(center.sourceUrl).toMatch(/^https?:\/\//);
      expect(typeof center.representativeDemo).toBe('boolean');
    }
  });

  it('orders current-region high-support contacts before national fallback', () => {
    const contacts = getHighSupportContacts('전북');
    expect(contacts[0].regionKey).toBe('전북');
    expect(contacts.some((contact) => contact.id === 'national-1388')).toBe(true);
    expect(contacts.findIndex((contact) => contact.regionKey === '전북')).toBeLessThan(
      contacts.findIndex((contact) => contact.id === 'national-1388'),
    );
  });
});

  it('adds a youth counseling connection entry for every supported region', () => {
    for (const region of regionOptions) {
      const counseling = getCentersByRegion(region.key).filter((center) => center.type.includes('청소년상담'));
      expect(counseling.length, `${region.label} counseling entry`).toBeGreaterThan(0);
      expect(counseling[0].phone).toContain('1388');
    }
  });
