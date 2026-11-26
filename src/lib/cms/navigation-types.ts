export interface NavigationDropdownItem {
  id: string;
  label: string;
  url: string;
  badge?: string;
  description?: string;
  openNewTab?: boolean;
}

export interface NavigationColumn {
  id: string;
  title: string;
  items: NavigationDropdownItem[];
}

export interface EnhancedNavigationItem {
  id: string;
  label: string;
  url: string;
  type?: "link" | "dropdown" | "mega" | "cta";
  badge?: string;
  openNewTab?: boolean;
  visible?: boolean;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  columns?: NavigationColumn[];
  items?: NavigationDropdownItem[];
}
