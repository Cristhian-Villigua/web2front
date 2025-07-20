import HeaderCliente from "../headercliente";
import "../../css/datoscliente.css";
const CuentaCliente = () => {
  return (
    <div>
        <>
            <HeaderCliente/>
        </>
        <div className="contenedorCuenta">
            <div className="bodycuenta">
                <h1>Mi cuenta</h1>
                <div className="titulocuenta">
                    <h2>Datos personales</h2>
                    <hr />
                </div>
                <div className="datoscuenta">
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>Nombres</h3>
                            <p>Nombres del cliente</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Apellidos</h3>
                            <p>Apellidos del cliente</p>
                        </div>
                    </div>
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>CI/RUC</h3>
                            <p>CI/RUC del cliente</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Correo electronico</h3>
                            <p>Correo electronico del cliente</p>
                        </div>
                    </div>                    
                    <h3>Telefono</h3>
                    <p>Telefono del cliente</p>
                </div>
                <div className="titulofacturacioncliente">
                    <h2>Facturación</h2>
                    <hr />
                </div>
                <div className="bodyfacturacioncliente">
                    <h3>Dirreccion</h3>
                    <p>direccion del cliente</p>
                    <div className="tarjetas flex-row">
                        <div className="tarjetaschild">
                            <h3>Ciudad</h3>
                            <p>ciudad del cliente</p>
                        </div>
                        <div className="tarjetaschild">
                            <h3>Provincia</h3>
                            <p>provincia del cliente</p>
                        </div>
                    </div>           
                </div>
                <h1>Metodo de Pago registrado</h1>
                <div className="titulocuenta">
                    <h2>tarjeta de credito o debito</h2>
                </div>
                <div className="tarjetas">
                    <div className="datotarjetas flex">
                        <div className="tarjetaschild">
                        <h3 className="datosdetarjetas">
                            Numero de tarjeta
                        </h3>
                        <p>xxxx</p>
                        </div>
                        <div className="tarjetaschild">
                        <h3 className="datosdetarjetas">
                            Nombre en la tarjeta
                        </h3>
                        <p>nombre en la tarjeta</p>
                        </div>
                        <div className="tarjetaschild">
                        <h3 className="cardnomber">
                            fecha de vencimiento
                        </h3>
                        <p>xx/xx</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CuentaCliente
