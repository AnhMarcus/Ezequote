import { useState, useEffect } from "react";
import '../components/slider.scss'


const slider = ({children}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
    const [slideDone, setSlideDone] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
    const [timeID, setTimeID] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (slideDone) {
      setSlideDone(false);
      setTimeID(
        setTimeout(() => {
          slideNext();
          setSlideDone(true);
        }, 5000)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideDone]);

  const slideNext = () => {
    setActiveIndex((val) => {
      if (val >= children.length - 1) {
        return 0;
      } else {
        return val + 1;
      }
    });
  };

  const slidePrev = () => {
    setActiveIndex((val) => {
      if (val <= 0) {
        return children.length - 1;
      } else {
        return val - 1;
      }
    });
  };

  const AutoPlayStop = () => {
    if (timeID > 0) {
      clearTimeout(timeID);
      setSlideDone(false);
    }
  };

  const AutoPlayStart = () => {
    if (!slideDone) {
      setSlideDone(true);
    }
  };

  return (
    <div className="container__slider" onMouseEnter={AutoPlayStop} onMouseLeave={AutoPlayStart}>
      {children.map((item, index) => {
        return (
          <div className={"slider__item slider__item-active-" + (activeIndex + 1)} key={index}>
            {item}
          </div>
        );
      })}

      <div className="container__slider__links">
        {children.map((item, index) => {
          return (
            <button key={index} className={ activeIndex === index ? "container__slider__links-small container__slider__links-small-active" : "container__slider__links-small"}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
            ></button>
          );
        })}
      </div>

      <button className="slider__btn-next" onClick={(e) => {
          e.preventDefault();
          slideNext();
        }}>
        {">"}
      </button>
      <button className="slider__btn-prev"
        onClick={(e) => {
          e.preventDefault();
          slidePrev();
        }}
      >
        {"<"}
      </button>
    </div>
  );
}

export default slider;
