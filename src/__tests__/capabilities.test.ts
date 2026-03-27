import { resolveSupportedFeatures } from '../vision-camera/capabilities';

describe('resolveSupportedFeatures', () => {
  it('returns safe defaults without a device', () => {
    const result = resolveSupportedFeatures(undefined);
    expect(result.flash).toBe(false);
    expect(result.filters).toBe(true);
  });
});
