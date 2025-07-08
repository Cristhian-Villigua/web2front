import '../css/Destinos.css'; 

interface FeatureItem {
  id: number;
  image: string;
  title: string;
}

const features: FeatureItem[] = [
  {
    id: 1,
    image: 'img/Manta.jpg',
    title: 'Manta',
  },
  {
    id: 2,
    image: 'img/Guayaquil.jpg',
    title: 'Guayaquil',
  },
  {
    id: 3,
    image: 'img/Loja.webp',
    title: 'Loja',
  },
];

function Destinos() {
  return (
    <section className="servicios">
      <div className="contenedor">
        <h2 className="titulo">Nuestros destinos</h2>
        <div className="servicio-cont">
          {features.map((feature: FeatureItem) => (
            <div className="servicio-ind" key={feature.id}>
              <img src={feature.image} alt={feature.title} />
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Destinos;