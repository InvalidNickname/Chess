import React from 'react';

function Square(props) {
    if (props.value === " ") {
        return <img className={props.className} onClick={props.onClick} alt=""/>
    } else {
        return <img src={"/images/" + props.value + ".svg"} className={props.className} onClick={props.onClick} alt=""/>
    }
}

export default Square