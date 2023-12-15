import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

export default function TagsInput(props) {
    const { menuData, setMenuData } = props;

    const { data } = useAuth();
    const tagSuggestions = data?.campaigns?.map(campaign => campaign.tags ?? []) ?? ['some', 'demo', 'tag', 'suggestions'];

    const tagInputElement = useRef();

    const [tagSuggestionsVisible, setTagSuggestionsVisible] = useState(false);
    const [inputSearchQuery, setInputSearchQuery] = useState('');

    function handleMouseDown(tag) {
        if (!tag) return;

        addNewTag(tag);
        setInputSearchQuery('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!tagInputElement.current?.value) return;

        addNewTag(tagInputElement.current.value);
        tagInputElement.current.value = '';
        setInputSearchQuery('');
    }

    function addNewTag(tag) {
        if (menuData.tags.includes(tag)) return;

        setMenuData({ ...menuData, tags: [...menuData.tags, tag] });
    }

    function deleteTag(tag) {
        const newTags = menuData.tags.filter(_tag => _tag !== tag);
        setMenuData({ ...menuData, tags: newTags });
    }

    return (
        <div className='flex flex-col justify-start items-start w-full'>
            <span>
                Tags
            </span>
            <div className='w-full p-1 bg-white' style={{ border: 'solid 1px grey', borderRadius: '6px' }}>
                <span>
                    {menuData.tags.map((tag, index) => (
                        <span key={index} className='inline-block rounded-full bg-gray-300 m-1 p-1'>
                            <div className='flex justify-center items-center gap-1 px-1'>
                                <span className='flex justify-center items-center ml-1'>
                                    {tag}
                                </span>
                                <span onClick={e => deleteTag(tag)}
                                    className='flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-500'
                                    style={{ height: '16px', width: '16px', border: 'solid darkgrey 2px' }}
                                >
                                    <FontAwesomeIcon icon={faX} fontSize='8px' />
                                </span>
                            </div>
                        </span>
                    ))}
                    <span className='relative inline-block w-full'>
                        <form className='w-full' onSubmit={e => handleSubmit(e)}>
                            <input ref={tagInputElement} placeholder='Type To Add Tags'
                                className='w-full m-1 p-1 bg-transparent'
                                style={{ border: 'none', outline: 'none' }}
                                onChange={e => setInputSearchQuery(e.target?.value ?? '')}
                                onFocus={e => setTagSuggestionsVisible(true)}
                                onBlur={e => setTagSuggestionsVisible(false)}
                            />
                        </form>
                        {tagSuggestionsVisible &&
                            <div className='absolute'>
                                {tagSuggestions
                                    .filter(tag => (
                                        (!inputSearchQuery || tag.includes(inputSearchQuery)) && !menuData.tags.includes(tag)
                                    )).map((tag, index) => (
                                        <div key={index} value={tag} onMouseDown={e => handleMouseDown(tag)}>
                                            {tag}
                                        </div>
                                    ))}
                            </div>
                        }
                    </span>
                </span>
            </div>
        </div>
    )
}
