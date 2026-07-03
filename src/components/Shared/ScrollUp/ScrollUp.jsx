"use client";

import { useEffect } from 'react';
import './ScrollUp.css';
import { AiOutlineArrowUp } from 'react-icons/ai';

const ScrollUp = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollUp = document.querySelector(".scrollup");
            if (scrollUp) {
                if (window.scrollY >= 560) scrollUp.classList.add("show-scroll");
                else scrollUp.classList.remove("show-scroll");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <a href="" className="scrollup">
            <AiOutlineArrowUp className='scrollup__icon'/>
        </a>
    );
};

export default ScrollUp;