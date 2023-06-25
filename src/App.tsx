import { useState } from 'react';
import './App.css';
import './assets/background_steps.png';
import { AppPageList } from './config/common';
import { PageContent } from './pages/Content';
import NavBar from './pages/common/NavBar';
import { BackgroundContent } from './pages/Background';

function App() {

  const [activePage, changePage] = useState(AppPageList.HOME);

  return (
    <>
      {/* <div id="site-bg-anim"></div> */}
      <BackgroundContent/>
      {/* <div id="site-overlay"></div>
      <div id="site-main">
        <PageContent/>
        <NavBar activePage={activePage} changePage={changePage}/>
      </div> */}
    </>
  )
}

export default App;
