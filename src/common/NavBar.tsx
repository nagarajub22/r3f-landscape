import './NavBar.css';
import { AppPageList, NavBarAction } from "../config/common";

function NavBar({ activePage, changePage }: NavBarAction) {

    const activePageClass = 'active';

    return (
        <ul id="site-navbar">
            <li 
                className={'site-navitem ' + (activePage === AppPageList.HOME ? activePageClass : '')}>
                <a href="#home" onClick={_ => changePage(AppPageList.HOME)}>Home</a>
            </li>
            <li>/</li>
            <li 
                className={'site-navitem ' + (activePage === AppPageList.ABOUT ? activePageClass : '')}>
                <a href="#about" onClick={_ => changePage(AppPageList.ABOUT)}>About</a>
            </li>
            <li>/</li>
            <li 
                className={'site-navitem ' + (activePage === AppPageList.CONTACT ? activePageClass : '')}>
                <a href="#contact" onClick={_ => changePage(AppPageList.CONTACT)}>Contact</a>
            </li>
        </ul>
    );
}

export default NavBar;