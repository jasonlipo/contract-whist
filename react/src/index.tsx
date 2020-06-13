import React from 'react';
import ReactDOM from 'react-dom';
import ContractWhist from './ContractWhist';

ReactDOM.render(<ContractWhist join_game={location.pathname.replace(/\//g, '').toUpperCase()} />, document.getElementById('root'));