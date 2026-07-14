import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

vi.mock('next/image', () => ({
  default: function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return React.createElement('img', props);
  },
}));

vi.mock('next/link', () => ({
  default: function Link({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) {
    return React.createElement('a', { href, ...props }, children);
  },
}));
