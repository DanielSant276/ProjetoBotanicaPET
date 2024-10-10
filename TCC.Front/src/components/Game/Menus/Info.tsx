import "./Info.css";
import backImage from "../../../imgs/icons/back.png";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { IPlant } from "../../../interfaces/IPlant";
import { getPlants } from "../Api/usePlants";
import { Modal } from "@mui/material";

// Carrega dinamicamente todas as imagens de plantas da pasta específica
const images = require.context("../../../imgs/plants", true);
const imageList = images.keys().map((image) => images(image));

export default function Info() {
  const navigate = useNavigate();

  const [plants, setPlants] = useState<IPlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<IPlant | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [screenLoaded, setScreenLoaded] = useState<boolean>(false);
  
  // Função para retornar à tela inicial
  const goToHomeScreen = () => {
    navigate(`/`);
  };

  // Função para abrir o modal com mais detalhes
  const handleOpenMoodal = (plant: IPlant) => {
    setSelectedPlant(plant);
    setOpenModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPlant(null);
  };

  // useEffect para carregar a lista de plantas ao montar o componente
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantsData = await getPlants();

        if (plantsData) {
          setPlants(plantsData);
          setScreenLoaded(true);
        }
      } catch (error) {
        console.error("Erro loading plants:", error);
      }
    };

    fetchPlants();
  }, []);

  return (
    <Fragment>
      {!screenLoaded && <div className="main-screen"></div>}

      {screenLoaded && (
        <div className="main-screen main-screen-info">
          <img src={backImage} className="info-back-button" onClick={() => goToHomeScreen()} alt="Botão de retornar a tela principal" />
          <div className="info-plants-space">
            {plants.map((plant) => (
              <div className="info-plant-box" key={plant.id}>
                <div className="info-box-imagem">
                  <img className="info-image" src={imageList[plant.id - 1]} alt="Imagem representativa da planta em questão" />
                </div>
                <div className="info-box-text">
                  <p className="info-box-title">{plant.name.toUpperCase()}</p>
                  <p className="info-box-title-scientific">{plant.scientificName}</p>
                  <p className="info-box-full-text info-space">Parte Utilizada: {plant.usedPart}</p>
                  <br/>
                  <p className="info-box-full-text info-space">{plant.summary}</p>
                  <div
                    className="info-box-show-more"
                    onClick={() => handleOpenMoodal(plant)}
                  >
                    <div className="info-box-show-more-intern">
                      <p className="info-box-show-more-text">MOSTRAR MAIS</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal open={openModal} onClose={handleCloseModal}>
            <div className="info-plant-modal">
              {selectedPlant && (
                  <div className="info-plant-box" key={selectedPlant.id}>
                  <img src={backImage} className="info-close-modal-button" onClick={handleCloseModal} alt="Botão de fechar o modal" />
                  <div className="info-box-imagem">
                    <img className="info-image" src={imageList[selectedPlant.id - 1]} alt="Imagem representativa da planta em questão" />
                  </div>
                  <div className="info-box-text">
                    <p className="info-box-title">{selectedPlant.name.toUpperCase()}</p>
                    <p className="info-box-title-scientific">{selectedPlant.scientificName}</p>
                    <p className="info-box-full-text">Parte Utilizada: {selectedPlant.usedPart}</p>
                    <br/>
                    <p className="info-box-full-text">{selectedPlant.about.split("Indicações:")[0]}</p>
                    <br/>
                    <p className="info-box-full-text">Indicações: {selectedPlant.about.split("Indicações:")[1]}</p>
                    <br/>
                    <p className="info-box-full-text">Curiosidades:</p>
                    <br/>
                    <ul>
                      {selectedPlant.curiosity.split("*").map((item, index) => (
                        <li key={`index-${selectedPlant.name}`} className="info-box-full-text">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <br/>
                    <p className="info-box-full-text">Referências: {selectedPlant.references}</p>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </div>
      )}
    </Fragment>
  );
}