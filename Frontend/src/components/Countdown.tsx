import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  targetDate: string | Date;
};

const Unit = ({ value, label }: { value: string; label: string }) => (
  <div className="d-flex flex-column justify-content-center align-items-center bg-white rounded-3 px-3 py-2 shadow-sm">
    <div className="lh-1" style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)" }}>
      {value}
    </div>
    <small className="text-uppercase fw-semibold text-muted secondary">{label}</small>
  </div>
);

const Countdown = ({ targetDate }: CountdownProps) => {
  const countDownTarget = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [diff, setDiff] = useState(countDownTarget - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(countDownTarget - Date.now()), 1000);
    return () => clearInterval(id);
  }, [countDownTarget]);

  if (diff <= 0) return <span>Topic closed</span>;

  const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
  const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

  return (
    <div className="d-flex align-items-center text-dark">
      <div className="w-100 ">
        <div className="row g-2 align-items-center flex-md-nowrap">
          {/* DAYS */}
          <div className="col-6 col-md-auto">
            <Unit value={days} label="days" />
          </div>

          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          {/* HOURS */}
          <div className="col-6 col-md-auto">
            <Unit value={hours} label="hours" />
          </div>

          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          {/* MINUTES */}
          <div className="col-6 col-md-auto">
            <Unit value={minutes} label="minutes" />
          </div>

          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          {/* SECONDS */}
          <div className="col-6 col-md-auto">
            <Unit value={seconds} label="seconds" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
