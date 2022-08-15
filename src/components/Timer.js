import React, { useEffect, useState, useContext } from 'react';
import { useTimer } from 'react-timer-hook';

const Timer = ({expiryTimestamp}) => {
    const { seconds, minutes, days, hours } =
        useTimer({
            autoStart: true,
            expiryTimestamp: expiryTimestamp,
            onExpire: () => {
                //
            },
        });
    return (
        <h5>
            <span>{days}</span> days <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span> hours
        </h5>
    )
}

export default Timer