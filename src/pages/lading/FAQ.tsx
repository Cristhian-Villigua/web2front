import React, { useState } from 'react';
import '../css/FAQ.css'; 


export interface FAQItem {
  id: number;
  question: string;
  answer: string; // This would typically be longer text
}

export const faqs: FAQItem[] = [
 {
  id: 1, 
  question: '¿Puedo comprar boletos de bus intercantonales e interprovinciales online?',
  answer: 'Sí, nuestra plataforma te permite comprar boletos de bus intercantonales e interprovinciales de manera fácil y segura desde cualquier dispositivo, evitando filas y asegurando tu asiento con anticipación.',
},
{
  id: 2,
  question: '¿Qué diferencia hay entre un bus intercantonal y uno interprovincial?',
  answer: 'Los buses intercantonales operan dentro de la misma provincia, conectando diferentes cantones. Los buses interprovinciales, por otro lado, conectan ciudades entre diferentes provincias, cubriendo distancias mayores.',
},
{
  id: 11,
  question: '¿Puedo planificar viajes con múltiples destinos o escalas en bus?',
  answer: 'Sí, nuestra plataforma te ofrece la flexibilidad de planificar itinerarios complejos. Puedes comprar un boleto para un primer tramo hacia una ciudad intermedia, y luego, desde esa misma ciudad, adquirir otro boleto para tu destino final.',
},
{
  id: 4,
  question: '¿Es posible llevar equipaje extra en el bus?',
  answer: 'Cada cooperativa de transporte tiene sus propias políticas de equipaje. Generalmente, se permite una maleta de mano y una o dos maletas grandes por pasajero sin costo adicional. Para equipaje extra o especial, podría aplicarse un cargo adicional. Te sugerimos consultar con la cooperativa antes de tu viaje.',
},
{
  id: 5, 
  question: '¿Con cuánta antelación debo llegar a la terminal de buses?',
  answer: 'Se recomienda llegar a la terminal al menos 30 minutos antes de la hora de salida programada para buses intercantonales y 45 a 60 minutos para rutas interprovinciales, especialmente en feriados o temporadas altas, para tener tiempo de despachar equipaje y ubicar tu andén.',
},
];

const FAQModule: React.FC = () => {
  // State to manage which FAQ item is open.
  // Stores the ID of the currently open item, or null if none are open.
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="faq-module-container">
      <h2 className="faq-title">Preguntas frecuentes</h2>
      <div className="faq-list">
        {faqs.map((item: FAQItem) => (
          <div className="faq-item" key={item.id}>
            <button
              className={`faq-question-button ${openItemId === item.id ? 'open' : ''}`}
              onClick={() => toggleFAQ(item.id)}
              aria-expanded={openItemId === item.id ? 'true' : 'false'}
            >
              <span>{item.question}</span>
              {/* This span will contain the arrow icon, styled with CSS */}
              <span className="faq-arrow"></span>
            </button>
            <div
              className={`faq-answer-container ${openItemId === item.id ? 'open' : ''}`}
              // Use maxHeight for smooth transition and content wrapping
              style={{ maxHeight: openItemId === item.id ? '200px' : '0px' }} // MaxHeight should be enough to contain any answer
            >
              <p className="faq-answer">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQModule;