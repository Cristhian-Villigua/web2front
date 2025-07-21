import Buscadortickets from "../../../components/BuscadorTockets/buscadortickets";
import HeaderCliente from "../headercliente";
import TarjetasPasajes from "./tarjetaspasajes";

const Mostrarpasajes  = () =>{
    return(
        <div>
            <>
            <HeaderCliente/>
            <Buscadortickets/>
            <TarjetasPasajes/>
            </>
        </div>
    )  
} 
export default Mostrarpasajes;