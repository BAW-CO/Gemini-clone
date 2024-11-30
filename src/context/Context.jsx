import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        },75*index)
    }

    const onSent = async (prompt) => {
        setResultData(""); // Clear previous result
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        setPrevPrompt((prev) => [...prev, input]);
    
        const response = await run(input);
    
        // Handle bold text with **
        let responseArray = response.split("**");
        let newResponse = "";
    
        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 1) {
                newResponse += `<b>${responseArray[i]}</b>`;
            } else {
                newResponse += responseArray[i];
            }
        }
    
        // Replace single asterisks with <br/>
        let formattedResponse = newResponse.replace(/\*/g, "<br/>");
        let wordArray = formattedResponse.split(" ");
    
        // Animate word by word display
        for (let i = 0; i < wordArray.length; i++) {
            const nextWord = wordArray[i] + " ";
            delayPara(i, nextWord);
        }
    
        setLoading(false);
        setInput("");
    };
    

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        // newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider

// is it prompts or props.children?