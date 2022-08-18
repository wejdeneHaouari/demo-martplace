import { useState, useEffect } from 'react';
import './index.css';
import { getRemainingTimeUntilMsTimestamp } from './utils';

const defaultRemainingTime = {
  seconds: '00',
  minutes: '00',
  hours: '00',
  days: '00',
};

const CountdownTimer = ({
  countdownTimestamp,
  setStoreOpen,
  storeOpen,
  showCounter,
}) => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;

  let countdownTimestampMs = Date.parse(countdownTimestamp) + offset;
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampMs);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownTimestampMs]);

  function updateRemainingTime(countdown) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }

  const storeOpenToggle = () => {
    if (
      remainingTime.days === '00' &&
      remainingTime.hours === '00' &&
      remainingTime.seconds === '00' &&
      remainingTime.minutes === '00'
    ) {
      setStoreOpen(true);
    } else setStoreOpen(false);
  };
  //Causing site to rerender based on timer, to determine if store is open or not.
  useEffect(() => {
    storeOpenToggle();
    // console.log('so', storeOpen);
  }, [remainingTime]);

  return (
    <>
      {!storeOpen && <h5>Store Opens In</h5>}
      {!storeOpen && showCounter && (
        <div>
          <div className='countdown__timer'>
            <div className='interval__ctn'>
              <span className='interval__data'>{remainingTime.days}</span>
              <span className='interval__name'>days</span>
            </div>
            <span className='interval__sperator'></span>
            <div className='interval__ctn'>
              <span className='interval__data'>{remainingTime.hours}</span>
              <span className='interval__name'>hours</span>
              <span className='interval__sperator'></span>
            </div>

            <span className='interval__sperator'></span>
            <div className='interval__ctn'>
              <span className='interval__data'>{remainingTime.minutes}</span>
              <span className='interval__name'>minutes</span>
            </div>

            <span className='interval__sperator'></span>
            <div className='interval__ctn'>
              <span className='interval__data'>{remainingTime.seconds}</span>
              <span className='interval__name'>seconds</span>
            </div>
          </div>
          <a href='./userSignup'>
            <button>Register Now</button>
          </a>
        </div>
      )}
    </>
  );
};

export default CountdownTimer;
