import React from 'react';
import Chip from '@material-ui/core/Chip';
import { useHistory } from 'react-router-dom';

function ParkChip({ label, type }) {
    const history = useHistory();
    const handleClick = () => {
        history.push(`/parks/${type}/${label}`)
    };
    return (

        <Chip label={label} onClick={handleClick} variant="outlined" />
    );
}

export default ParkChip;