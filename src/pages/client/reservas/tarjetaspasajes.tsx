
const TarjetasPasajes = () => {
  return (
    <div>
    <div className="card shadow border-0 mb-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="card-body">
        {/* IDA */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-secondary fw-bold mb-0">IDA</h6>
            <small className="text-muted">mié. 23 jul. 2025</small>
          </div>
          <div className="d-flex align-items-center mt-2">
            <img
              src="https://logodownload.org/wp-content/uploads/2019/09/avianca-logo-0.png"
              alt="avianca"
              width="24"
              height="24"
              className="me-2"
            />
            <div>
              <div className="fw-bold">06:10 - 07:00</div>
              <div className="text-muted">Directo • 50 min</div>
              <div className="text-muted">MEC → UIO</div>
            </div>
          </div>
        </div>

        {/* VUELTA */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-secondary fw-bold mb-0">VUELTA</h6>
            <small className="text-muted">vie. 25 jul. 2025</small>
          </div>
          <div className="d-flex align-items-center mt-2">
            <img
              src="https://logodownload.org/wp-content/uploads/2019/09/avianca-logo-0.png"
              alt="avianca"
              width="24"
              height="24"
              className="me-2"
            />
            <div>
              <div className="fw-bold">04:30 - 05:20</div>
              <div className="text-muted">Directo • 50 min</div>
              <div className="text-muted">UIO → MEC</div>
            </div>
          </div>
        </div>

        {/* Precio y botón */}
        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">1 Adulto</div>
            <div className="fw-semibold">USD 112</div>
            <div className="text-muted small">Impuestos y cargos: USD 67</div>
          </div>
          <div className="text-end">
            <div className="fw-bold">Precio final: USD 179</div>
            <button className="btn btn-primary btn-sm mt-1">Comprar</button>
          </div>
        </div>
      </div>
    </div>
    <div className="card shadow border-0 mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card-body">
        {/* IDA */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-secondary fw-bold mb-0">IDA</h6>
            <small className="text-muted">mié. 23 jul. 2025</small>
          </div>
          <div className="d-flex align-items-center mt-2">
            <img
              src="https://logodownload.org/wp-content/uploads/2019/09/avianca-logo-0.png"
              alt="avianca"
              width="24"
              height="24"
              className="me-2"
            />
            <div>
              <div className="fw-bold">06:10 - 07:00</div>
              <div className="text-muted">Directo • 50 min</div>
              <div className="text-muted">MEC → UIO</div>
            </div>
          </div>
        </div>

        {/* Precio y botón */}
        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small">1 Adulto</div>
            <div className="fw-semibold">USD 112</div>
            <div className="text-muted small">Impuestos y cargos: USD 67</div>
          </div>
          <div className="text-end">
            <div className="fw-bold">Precio final: USD 179</div>
            <button className="btn btn-primary btn-sm mt-1">Comprar</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TarjetasPasajes;
