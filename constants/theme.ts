const Colors = {
  black: '#18181b',
  white: '#ffffff',
  background: '#fafafa',
  surface: '#ffffff',
  border: '#e4e4e7',
  borderStrong: '#18181b',
  borderLight: '#f4f4f5',
  textPrimary: '#18181b',
  textSecondary: '#71717a',
  textMuted: '#a1a1aa',
  textInverse: '#ffffff',
  textLink: '#52525b',
  successBg: '#dcfce7',
  successText: '#166534',
  successBorder: '#166534',
  infoBg: '#dbeafe',
  infoText: '#1e40af',
  infoBorder: '#1e40af',
  warningBg: '#fef9c3',
  warningText: '#854d0e',
  warningBorder: '#854d0e',
  dangerBg: '#fee2e2',
  dangerText: '#b91c1c',
  dangerBorder: '#b91c1c',
  activeGreen: '#10b981',
  activeGreenBg: 'rgba(16, 185, 129, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, section: 40 };
const Radii = { sm: 6, md: 8, lg: 12, xl: 16, xxl: 24, full: 9999 };

const CardBorder = {
  borderWidth: 2,
  borderColor: Colors.borderStrong,
  borderBottomWidth: 6,
  borderRightWidth: 4,
  borderRadius: Radii.lg,
};

const Shadows = {
  md: { shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
};

const Typography = {
  displayLg: { fontSize: 32, fontWeight: '900' as const, letterSpacing: 2 },
  displayMd: { fontSize: 24, fontWeight: '900' as const, letterSpacing: 0.5 },
  displaySm: { fontSize: 20, fontWeight: '900' as const },
  titleLg: { fontSize: 16, fontWeight: '900' as const, textTransform: 'uppercase' as const },
  titleMd: { fontSize: 15, fontWeight: '900' as const, textTransform: 'uppercase' as const },
  titleSm: { fontSize: 13, fontWeight: '800' as const, textTransform: 'uppercase' as const, letterSpacing: 1 },
  body: { fontSize: 16, fontWeight: '600' as const },
  bodyMd: { fontSize: 14, fontWeight: '600' as const },
  bodySm: { fontSize: 13, fontWeight: '600' as const },
  label: { fontSize: 12, fontWeight: '800' as const, textTransform: 'uppercase' as const, letterSpacing: 1 },
  caption: { fontSize: 10, fontWeight: '800' as const, textTransform: 'uppercase' as const },
  link: { fontSize: 13, fontWeight: '700' as const, textDecorationLine: 'underline' as const },
};

const Layouts = {
  headerHeight: 140,
  tabBarHeight: 80,
};

const Brutalist = {
  card: { ...CardBorder, ...Shadows.md, backgroundColor: Colors.surface },
  inner: { backgroundColor: '#f1f1f1', borderWidth: 2, borderColor: Colors.black, borderRadius: Radii.md },
};

export { Brutalist, CardBorder, Colors, Layouts, Radii, Shadows, Spacing, Typography };
