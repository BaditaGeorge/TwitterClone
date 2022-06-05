import { Button } from "@mui/material";
import * as react from "react";

export default function VideoInput({ width, height, setSource, setFile }) {
    const inputRef = react.useRef();
    let source = undefined;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSource(url);
        setFile(file);
        source = url;
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    return (
        <div className="videoInput">
            <input ref={inputRef} style={{display:'none'}} className="videoInput_input" type="file" onChange={handleFileChange} />
            {!source && <Button variant="contained" onClick={handleChoose}>Pick video</Button>}
        </div>
    );
}