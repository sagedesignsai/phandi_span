import localFont from 'next/font/local';

// Fira Sans - Primary Typography Font
export const firaSans = localFont({
  src: [
    {
      path: '../assets/fonts/fira-sans/FiraSans-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-sans/FiraSans-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-fira-sans',
  display: 'swap',
});

// Fira Code - Monospace Font (Code blocks, technical content)
export const firaCode = localFont({
  src: [
    {
      path: '../assets/fonts/fira-code/static/FiraCode-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-code/static/FiraCode-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-code/static/FiraCode-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-code/static/FiraCode-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-code/static/FiraCode-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-fira-code',
  display: 'swap',
});

// Alternative: Fira Code Variable Font (more efficient, single file)
export const firaCodeVariable = localFont({
  src: '../assets/fonts/fira-code/FiraCode-VariableFont_wght.ttf',
  variable: '--font-fira-code-variable',
  display: 'swap',
  weight: '300 700',
});

// Fira Mono - Alternative Monospace
export const firaMono = localFont({
  src: [
    {
      path: '../assets/fonts/fira-mono/FiraMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-mono/FiraMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/fira-mono/FiraMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-fira-mono',
  display: 'swap',
});

// Comodo - Decorative Font
export const comodo = localFont({
  src: '../assets/fonts/comodo-font/comodo-regular.otf',
  variable: '--font-comodo',
  display: 'swap',
  weight: '400',
});

// Surgena - Decorative Font
export const surgena = localFont({
  src: [
    {
      path: '../assets/fonts/surgena-font/surgena-light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-lightitalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-mediumitalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/surgena-font/surgena-bolditalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-surgena',
  display: 'swap',
});

// Inter - Variable Font (Primary UI Font)
export const inter = localFont({
  src: [
    {
      path: '../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});


