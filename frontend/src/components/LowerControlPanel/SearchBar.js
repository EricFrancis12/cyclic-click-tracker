import React from 'react';

export default function SearchBar(props) {
    const { searchQuery, setSearchQuery } = props;

    return (
        <div>
            <input value={searchQuery} onInput={e => setSearchQuery(e.target.value)}></input>
        </div>
    )
}
