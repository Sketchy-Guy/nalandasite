import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import { EnhancedHero } from './enhanced-hero';

interface PageLayoutProps {
  children: ReactNode;
  heroTitle: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroBadge?: string;
  heroHeight?: 'small' | 'medium' | 'large';
  heroChildren?: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroImage,
  heroBadge,
  heroHeight = 'medium',
  heroChildren,
  className = ''
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header />
      <main>
        <EnhancedHero
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          imageUrl={heroImage}
          badge={heroBadge}
          height={heroHeight}
        >
          {heroChildren}
        </EnhancedHero>
        <div className="container mx-auto px-4 py-16">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}