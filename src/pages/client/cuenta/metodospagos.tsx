import HeaderCliente from "../headercliente";
import "../../css/datoscliente.css"

const Metodospagoscliente = () => {

return(
    <div>
    <>
        <HeaderCliente/>
    </>
    <div className="metodosdepago">
        <h1>Metodo de Pago registrado</h1>
        <h2>tarjeta de credito o debito</h2>
        <div className="tarjetas">
            <h3 className="datostarjetas">
                Numero de tarjeta
            </h3>
            <input type="number" name="tarjeta" placeholder="Tarjeta habiente" />
            <h3 className="datostarjetas">
                Nombre en la tarjeta
            </h3>
            <input type="number" name="duenotarjeta" placeholder="tarjeta habiente" />
            <h3 className="cardnomber">
                mes de vencimiento
            </h3>
            <input type="number" name="mesvencimiento" placeholder="mes de vencimiento" />
             <h3 className="cardnomber">
                año de vencimiento
            </h3>
            <input type="number" name="vencimientoyear" placeholder="año de vencimiento" />
        </div>
    </div>
    </div>    
)
}
export default Metodospagoscliente