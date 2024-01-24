import { Carousel } from "react-bootstrap";
import ImageOne from "/Carousel/1.svg";
import ImageTwo from "/Carousel/1.svg";
import "./HomeCarousel.css";

function HomeCarousel() {
    return (
        <div className="carousel-container" data-bs-theme="dark">
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={ImageOne} alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={ImageTwo} alt="Second slide" />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default HomeCarousel;