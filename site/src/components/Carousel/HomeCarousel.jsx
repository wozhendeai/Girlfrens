import { Carousel } from "react-bootstrap";
import ImageTwo from "/Carousel/2.svg";
import ImageThree from "/Carousel/3.svg";
import "./HomeCarousel.css";

function HomeCarousel() {
    return (
        <div className="carousel-container" data-bs-theme="dark">
            <Carousel>
                <Carousel.Item>
                    <img className="d-block w-100" src={ImageTwo} alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={ImageThree} alt="Second slide" />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default HomeCarousel;