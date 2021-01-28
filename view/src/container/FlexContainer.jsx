import React from "react";

const FlexContainer = (props)=>{
    const style = {
        display         : 'flex',
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : '100vh',
    };

    return (
        <div style={style} className={props.className}>
            {props.children}
        </div>
    );
}

export default FlexContainer