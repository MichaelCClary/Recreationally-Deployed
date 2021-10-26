import { render, screen } from '@testing-library/react';
import { renderWithState } from '../RenderWithState';
import Homepage from './Homepage';
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store"
// jest.mock("./r", () => ({
//     getUserData: () => ({ name: "mock name" })
//   }));

const initialState = {
    users: null,
};

//smoke test
it('it renders without crashing', () => {
    <Provider store={store}>
        render(<Homepage />)
    </Provider>,
})

// snapshot test
// it("matches snapshot", function () {
//     const { asFragment } = render(<Homepage />);
//     expect(asFragment()).toMatchSnapshot();
// });