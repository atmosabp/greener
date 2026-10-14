export type HeaderLink = { label: string; to: string } | { label: string; href: string }; 

export interface HeaderProps {
  links: HeaderLink[];
  action: React.ReactNode;
  message?: React.ReactNode;
  activeHref?: string; // opcional: link ativo (para a landing)
}