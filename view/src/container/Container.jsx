import React from "react";

const Container = (props)=>{
    const style = {
        display         : 'flex',
        marginTop       : "6rem",
    };

    return (
        <div style={style}>
            {props.children}
        </div>
    );
}

export default Container