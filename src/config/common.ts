export enum AppPageList {
    HOME = 'Home',
    ABOUT = 'About',
    CONTACT = 'Contact'
}

export interface NavBarAction {
    activePage: string;
    changePage: (pageName: AppPageList) => void
}