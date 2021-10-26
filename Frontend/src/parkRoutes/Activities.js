import React from 'react';
import { shallowEqual, useSelector } from "react-redux";
import ParkChip from './ParkChip';
function Activities() {
    const { activities } = useSelector((state => state.parks), shallowEqual);

    return (
        <>
            <h1>Browse Parks By Activity</h1>
            {activities && activities.map((activity) => (
                <ParkChip key={activity.name} label={activity.name} type="activities" />
            ))}
        </>

    );
}

export default Activities;