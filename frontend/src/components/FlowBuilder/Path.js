import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ActionMenu from '../ActionMenu/ActionMenu';
import Checkbox from '../Checkbox';
import WrappableSelect from '../WrappableSelect';
import useMatchOffset from '../../hooks/useMatchOffset';
import FlowConfig from '../../config/Flow.config.json';
const { types: FLOW_TYPES, routeTypes: ROUTE_TYPES } = FlowConfig;

export const DEFAULT_PATH = {
    weight: 100,
    landingPages: [],
    offers: [],
    active: true,
    directLinkingEnabled: false
};

export default function Path(props) {
    const { path, route, routeType, flow, setFlow } = props;
    const { createNewLandingPage, createNewOffer } = props;

    const { data } = useAuth();

    const [newPath, setNewPath] = useState(path);

    const items = [
        {
            singName: 'Landing Page',
            pluralName: 'Landing Pages',
            prop: 'landingPages',
            options: data?.landingPages ?? [],
            data: path?.landingPages ?? [],
            makeNew: () => createNewLandingPage()
        },
        {
            singName: 'Offer',
            pluralName: 'Offers',
            prop: 'offers',
            options: data?.offers ?? [],
            data: path?.offers ?? [],
            makeNew: () => createNewOffer()
        }
    ];

    const offsetLeftPixels = useMatchOffset({
        startSelector: '#match-offset-start',
        endSelector: '#match-offset-end',
        offset: 'left'
    },
        [flow.type, flow.defaultRoute.paths, flow.ruleRoutes]
    );

    useEffect(() => {
        if (routeType === ROUTE_TYPES.DEFAULT) {
            setFlow({
                ...flow,
                defaultRoute: {
                    ...flow.defaultRoute,
                    paths: flow.defaultRoute.paths.map(_path => {
                        if (_path === path) {
                            return structuredClone(newPath);
                        }
                        return _path;
                    })
                }
            });
        } else if (routeType === ROUTE_TYPES.RULE) {
            setFlow({
                ...flow,
                ruleRoutes: flow.ruleRoutes.map(ruleRoute => {
                    if (ruleRoute.paths.includes(path)) {
                        return {
                            ...ruleRoute,
                            paths: ruleRoute.paths.map(_path => {
                                if (_path === path) {
                                    return structuredClone(newPath);
                                }
                                return _path;
                            })
                        };
                    }
                    return ruleRoute;
                })
            });
        }
    }, [newPath, newPath?.landingPages?.length, newPath?.offers?.length]);

    function handleChecked(pathProperty) {
        if (!pathProperty) return;

        setNewPath({
            ...path,
            // inverting pathProperty when checkbox is checked:
            [pathProperty]: !path[pathProperty]
        });
    }

    function handleNewItem(prop) {
        setNewPath({
            ...path,
            [prop]: [...path[prop], {
                ...data?.[prop]?.at(0),
                weight: 100
            }]
        });
    }

    function handleItemChange(prop, dataItem, newValue) {
        setNewPath({
            ...path,
            [prop]: path[prop].map(propItem => {
                if (propItem === dataItem) {
                    return { ...propItem, ...newValue };
                }
                return propItem;
            })
        });
    }

    function handleItemDelete(prop, dataItem) {
        setNewPath({
            ...path,
            [prop]: path[prop].filter(propItem => propItem !== dataItem)
        });
    }

    function handlePathDelete() {
        if (routeType === ROUTE_TYPES.DEFAULT) {
            setFlow({
                ...flow,
                defaultRoute: {
                    ...flow.defaultRoute,
                    paths: flow.defaultRoute.paths.filter(_path => _path !== path)
                }
            });
        } else if (routeType === ROUTE_TYPES.RULE) {
            setFlow({
                ...flow,
                ruleRoutes: flow.ruleRoutes.map(ruleRoute => {
                    if (ruleRoute === route) {
                        return {
                            ...ruleRoute,
                            paths: ruleRoute.paths.filter(_path => _path !== path)
                        }
                    }
                    return ruleRoute;
                })
            });
        }
    }

    function handlePathWeightChange(newWeight) {
        setNewPath({
            ...path,
            weight: newWeight
        });
    }

    function handleItemWeightChange(prop, dataItem, newWeight) {
        if (!newWeight) newWeight = 0;
        setNewPath({
            ...path,
            [prop]: path[prop].map(propItem => {
                if (propItem === dataItem) {
                    return { ...propItem, weight: newWeight };
                }
                return propItem;
            })
        });
    }

    function calcWeightResult(weight, weights) {
        const total = weights.reduce((sum, num) => sum + num, 0);
        const percentageOfTotal = (weight / total) * 100;
        return `${Math.floor(percentageOfTotal)}`;
    }

    return (
        <div className='w-full bg-gray-300 px-2' style={{ borderRadius: '5px' }}>
            <div className='flex justify-between items-center py-3'>
                <div className='flex justify-start items-center'>
                    <div>
                        <span className={path.active ? '' : 'line-through'}>
                            Path
                        </span>
                    </div>
                </div>
                <div className='flex justify-end items-center gap-2'>
                    {path.active &&
                        <div className='flex justify-center items-center gap-2'>
                            <span>
                                Weight:
                            </span>
                            <input className='w-[40px] p-1' style={{ borderRadius: '6px' }}
                                value={path.weight}
                                onChange={e => handlePathWeightChange(parseFloat(e.target.value))}
                            />
                        </div>
                    }
                    <div className='flex justify-center items-center gap-2'>
                        {path.active &&
                            <>
                                <span>
                                    {`(${calcWeightResult(path.weight, route.paths.map(path => path.weight))}%)`}
                                </span>
                                {route?.paths?.length > 1 &&
                                    <span className='cursor-pointer text-red-500' onClick={e => handlePathDelete()}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </span>
                                }
                            </>
                        }
                        <Checkbox checked={path.active}
                            onChange={e => handleChecked('active')}
                        />
                    </div>
                </div>
            </div>
            {path.active &&
                <>
                    {items.map((item, index) => (
                        <div key={index} className='my-2'>
                            <div className='relative flex justify-between items-center bg-white h-[40px] my-1 px-2'>
                                <div className='flex justify-start items-center gap-2'>
                                    <span>
                                        {item.pluralName}
                                    </span>
                                    {index === 0 &&
                                        <Checkbox checked={!path.directLinkingEnabled}
                                            onChange={e => handleChecked('directLinkingEnabled')}
                                        />
                                    }
                                </div>
                                {!path.directLinkingEnabled && offsetLeftPixels !== '0px' &&
                                    <div className='absolute' style={{ left: offsetLeftPixels }}>
                                        <span>
                                            Weight
                                        </span>
                                    </div>
                                }
                            </div>
                            {index === 0 && path.directLinkingEnabled
                                ? <div className='flex justify-center items-center bg-white h-[40px] my-1 px-2'>
                                    <span>
                                        Direct Linking Enabled
                                    </span>
                                </div>
                                : <>
                                    <div className='flex flex-col justify-center items-center min-h-[40px] bg-white'>
                                        {item?.data?.length === 0
                                            ? <span className='text-xs'>
                                                No {item.pluralName} Added
                                            </span>
                                            : item.data.map((_dataItem, _index) => (
                                                <div key={_index} id='match-offset-start'
                                                    className='flex justify-between items-center gap-2 bg-white h-[40px] my-1 px-2'
                                                >
                                                    <div className='flex justify-start items-center gap-2'>
                                                        <span>
                                                            {_index + 1}
                                                        </span>
                                                        <WrappableSelect array={item.options}
                                                            value={_dataItem}
                                                            name={element => element.name}
                                                            matchBy={element => element._id}
                                                            onChange={value => handleItemChange(item.prop, _dataItem, value)}
                                                        />
                                                    </div>
                                                    <div className='flex justify-end items-center gap-1'>
                                                        <div id='match-offset-end' className='flex justify-center items-center' style={{ border: 'solid 1px grey', borderRadius: '6px' }}>
                                                            <div className='flex justify-center items-center w-[50%] px-3 py-1' style={{ borderRight: 'solid 1px grey' }}>
                                                                <input className='text-center w-full border-none outline-none'
                                                                    value={_dataItem.weight}
                                                                    onChange={e => handleItemWeightChange(item.prop, _dataItem, parseFloat(e.target.value))}
                                                                />
                                                            </div>
                                                            <div className='flex justify-center items-center w-[50%] px-3 py-1' style={{ borderLeft: 'solid 1px grey' }}>
                                                                {`(${calcWeightResult(_dataItem.weight, item.data.map(a => a.weight))}%)`}
                                                            </div>
                                                        </div>
                                                        <div className='cursor-pointer hover:text-button_backgroundColor'>
                                                            <a href={_dataItem.url} target='_blank'>
                                                                <FontAwesomeIcon icon={faExternalLink} />
                                                            </a>
                                                        </div>
                                                        <div className='cursor-pointer hover:text-button_backgroundColor'>
                                                            <FontAwesomeIcon icon={faPencilAlt} />
                                                        </div>
                                                        <div className='cursor-pointer hover:text-red-500'
                                                            onClick={e => handleItemDelete(item.prop, _dataItem)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className='flex justify-between items-center bg-white h-[40px] my-1 px-2'>
                                        <div onClick={item.makeNew}
                                            className='flex justify-center items-center h-full w-[50%] cursor-pointer'
                                            style={{ borderRight: 'solid 1px grey' }}
                                        >
                                            <span>
                                                {'Add New ' + item.singName}
                                            </span>
                                        </div>
                                        <div onClick={e => handleNewItem(item.prop)}
                                            className='flex justify-center items-center h-full w-[50%] cursor-pointer'
                                            style={{ borderLeft: 'solid 1px grey' }}
                                        >
                                            <span>
                                                {'+ New ' + item.singName}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    ))}
                </>
            }
        </div>
    )
}
