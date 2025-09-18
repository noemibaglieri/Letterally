import { faAlarmClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string | Date;
};

const Countdown = ({ targetDate }: CountdownProps) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  if (countDown <= 0) {
    return <span>Topic closed</span>;
  }

  const days = String(Math.floor(countDown / (1000 * 60 * 60 * 24))).padStart(2, "0");
  const hours = String(Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
  const seconds = String(Math.floor((countDown % (1000 * 60)) / 1000)).padStart(2, "0");

  return (
    <span>
      <div className="d-flex align-items-center text-dark gap-2">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fs-1 text-white" icon={faAlarmClock} />
        </div>
        <div className="d-flex flex-column p-3 rounded-3 text-center bg-white">
          <h4 className="mb-0">{days}</h4>
          <p className="text-uppercase mb-0 secondary custom-fs">days</p>
        </div>
        <div className="text-white fs-1 align-self-start">:</div>

        <div className="d-flex flex-column  p-3 rounded-3 text-center bg-white">
          <h4 className="mb-0">{hours}</h4>
          <p className="text-uppercase mb-0 secondary custom-fs">hours</p>
        </div>
        <div className="text-white fs-1 align-self-start">:</div>

        <div className="d-flex flex-column p-3 rounded-3 text-center bg-white">
          <h4 className="mb-0">{minutes}</h4>
          <p className="text-uppercase mb-0 secondary custom-fs">minutes</p>
        </div>
        <div className="text-white fs-1 align-self-start">:</div>

        <div className="d-flex flex-column p-3 rounded-3 text-center bg-white">
          <h4 className="mb-0">{seconds}</h4>
          <p className="text-uppercase mb-0 secondary custom-fs">seconds</p>
        </div>
      </div>
    </span>
  );
};

export default Countdown;
