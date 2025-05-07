import React from 'react';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, isAuthenticated }) => {
  // Removed unused 'location' variable

  // Define o fundo com base no estado de autenticação
  const backgroundClass = isAuthenticated ? 'logged-background' : 'unlogged-background';

  return (
    <div className={`page-layout ${backgroundClass}`}>
      {children}
    </div>
  );
};

export default PageLayout;