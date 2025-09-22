import { Placeholder } from "react-bootstrap";

const UnitPlaceholder = () => (
  <div
    className="d-flex justify-content-center align-items-center rounded-3 shadow-sm"
    style={{
      backgroundColor: "#f1f1f1",
      width: "4rem",
      height: "4rem",
    }}
  >
    <Placeholder animation="wave">
      <Placeholder xs={6} style={{ opacity: 0 }} />
    </Placeholder>
  </div>
);

const CountdownPlaceholder = () => {
  return (
    <div className="d-flex align-items-center text-dark">
      <div className="w-100">
        <div className="row g-2 align-items-center flex-md-nowrap">
          <div className="col-6 col-md-auto">
            <UnitPlaceholder />
          </div>
          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          <div className="col-6 col-md-auto">
            <UnitPlaceholder />
          </div>
          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          <div className="col-6 col-md-auto">
            <UnitPlaceholder />
          </div>
          <div className="col-auto d-none d-md-flex text-white fs-2 align-self-start">:</div>

          <div className="col-6 col-md-auto">
            <UnitPlaceholder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownPlaceholder;
