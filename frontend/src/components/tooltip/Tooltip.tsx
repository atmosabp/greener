import type { ReactNode } from "react";
import "./Tooltip.css";

interface TooltipProps {
  text: string;
}

export default function Tooltip({text}: TooltipProps) {

   function addLineBreak  (str: string): ReactNode {

    let lines : string[] =str.split('\n')
    let formatedText = <>{lines.map((text) =>{
        return(
            <>
            {text}
            <br/>
            </>
        )
    })
    }</>
    return formatedText
  }


  return (
    <div className="tooltip-element" >
      <strong>?</strong>
      <span className="tooltip">{addLineBreak(text)}</span>
    </div>
  );
}
