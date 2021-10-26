import React from 'react';
import { shallowEqual, useSelector } from "react-redux";
import ParkChip from './ParkChip';

function Topics() {
    const { topics } = useSelector((state => state.parks), shallowEqual);

    return (
        <>
            <h1>Browse Parks By Topic</h1>
            {topics && topics.map((topic) => (
                <ParkChip key={topic.name} label={topic.name} type="topics" />
            ))}
        </>

    );
}

export default Topics;