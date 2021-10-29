import { render, screen } from '@testing-library/react';
import Activities from './Activities';
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store"


//smoke test
it('it renders without crashing', () => {
    <Provider store={store}>
        render(<Activities />)
    </Provider>
})