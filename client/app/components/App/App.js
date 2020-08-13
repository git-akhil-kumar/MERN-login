import React, { Component } from 'react';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const App = ({ children }) => (
  <>
    <Header />

    <main>
    	<button>Submit</button>
      {children}
    </main>

    <Footer />
  </>
);

export default App;
