import React from 'react';

export default function SearchBar(props) {
    const { searchQuery, setSearchQuery } = props;

    return (
        <input value={searchQuery} onInput={e => setSearchQuery(e.target.value)}></input>
    )
}
