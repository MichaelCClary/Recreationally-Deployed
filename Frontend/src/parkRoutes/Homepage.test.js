import { render, screen } from '@testing-library/react';
import 'regenerator-runtime/runtime'
import Homepage from './Homepage';
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store"


const initialState = {
    users: null,
};

//smoke test
it('it renders without crashing', () => {
    <Provider store={store}>
        render(<Homepage />)
    </Provider>
})

