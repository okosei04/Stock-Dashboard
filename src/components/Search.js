import React, { useContext, useState } from 'react'
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import SearchResults from './SearchResults';
import ThemeContext from '../context/ThemeContext';
import { searchSymbols } from '../api/stock-api';

const Search = () => {
    const [input, setInput] = useState("");
    const [bestMatches, setBestMatches] = useState([]);
    const { darkMode } = useContext(ThemeContext);

    const clear = () => {
        setInput("");
        setBestMatches([]);
    };

    const updateBestMatches = async () => {
        try {
            if (input) {
                const searchResults = await searchSymbols(input);
                const result = searchResults.result;
                setBestMatches(result);
            }
        } catch (error) {
            setBestMatches([]);
            console.error(error);
            // Optionally, inform the user that an error occurred.
        }
    };

    return (
        <div className={`flex items-center my-4 border-2 rounded-md relative z-50 w-96 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"}`}>
            <input
                type="text" value={input}
                className={`w-full px-4 py-2 focus:outline-none rounded-md ${darkMode ? "bg-gray-900" : "bg-white"}`}
                placeholder='Search stock...'
                onChange={(event) => setInput(event.target.value)}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        updateBestMatches();
                    }
                }}
            />

            {input && (
                <button onClick={clear} className='m-2'>
                    <XMarkIcon className="w-5 h-5 text-neutral-400 hover:text-neutral-500"/>
                </button>
            )}
            <button onClick={updateBestMatches} className='h-8 w-8 bg-blue-600 rounded-md flex justify-center items-center m-1 p-2
            transition duration-300 hover:ring-2 ring-blue-400' aria-label="Search">
                <MagnifyingGlassIcon className='h-4 w-4 fill-gray-100'/>
            </button>
            {input && bestMatches.length > 0 ? <SearchResults results={bestMatches}/> : null}
        </div>
    )
}

export default Search