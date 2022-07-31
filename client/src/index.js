import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DAppProvider, Mainnet,Rinkeby,Mumbai } from "@usedapp/core";

import './bootstrap.min.css';
import './index.css';
import App from './App';
import configStore from './store/configStore';

const store = configStore();
const INFURA_PROJECT_ID = "6606d56974ac469e86a5347a6cb36f50";
const config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: "https://rinkeby.infura.io/v3/" + INFURA_PROJECT_ID,
  },
}

ReactDOM.render(
  <DAppProvider config={config}>
  <Provider store={store}>
    <App />
  </Provider>
  </DAppProvider>,

  document.getElementById('root')
);
