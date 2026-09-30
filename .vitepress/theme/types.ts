export interface NavItem {
  text: string
  link: string
}

export interface SidebarGroup {
  text: string
  items: NavItem[]
}

export interface OutlineItem {
  id: string
  text: string
  level: number
}

export interface Topic {
  title: string
  description: string
}
