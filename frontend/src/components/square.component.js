import React from 'react';

function Square(props) {
    if (props.value === " ") {
        return <div className={props.className} onClick={props.onClick}/>
    } else {
        return <img src={"/images/" + props.value + ".svg"} className={props.className} onClick={props.onClick} alt=""
                    draggable="false"/>
    }
}

export default Square