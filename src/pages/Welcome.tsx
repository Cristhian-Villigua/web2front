import { Link } from "react-router-dom"
import HeaderPublico from "./lading/header"
import Buscadortickets from "../components/BuscadorTockets/buscadortickets"
import Destinos from "./lading/Destinos"
import FooterPublico from "./lading/FooterPublico"
import FAQModule from "./lading/FAQ"

const Welcome = () => {
  return (
    <>
    <HeaderPublico/>
    <Buscadortickets/>
    <Destinos/>
    <FAQModule/>
    <FooterPublico/>
    </>
  )
}

export default Welcome
