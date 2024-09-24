import React, { Fragment } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import MasterBanner from "./MasterBanner";

const Data = [
  {
    img: "home1",
    title: "Uniforms Simplified.",
    desc: "Your all-in one Henry Ford Health employee unform platform. Browse and shop the highest quality HFH Apparel Unforms and Promotional Products with the click of a button.",
    link: "/left-sidebar/collection ",
  },
  // {
  //   img: "home2",
  //   title: "welcome to fashion",
  //   desc: "women fashion",
  //   link: "/left-sidebar/collection ",
  // },
];

const Banner = () => {
  return (
    <Fragment>
      <section className="p-0">
        <Slider className="slide-1 home-slider">
          {Data.map((data, i) => {
            return (
              <MasterBanner
                key={i}
                img={data.img}
                desc={data.desc}
                title={data.title}
                link={data.link}
              />
            );
          })}
        </Slider>
      </section>
    </Fragment>
  );
};

export default Banner;
