import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './App';


import { initialize, Locales } from './i18n';

initialize(Locales.de).then(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
