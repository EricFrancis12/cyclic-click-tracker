import React, { useState, useEffect } from 'react';
import useWindowResize from './useWindowResize';

export default function useMatchOffset(options = {}, dependencies = []) {
    const { selector, startSelector, endSelector, direction, startDirection = 'left', endDirection = 'left', customCalculation } = options;
    // direction, startDirection, endDirection can be 'left', 'right', 'top', or 'bottom'
    // to identify the respective offset property you are targeting:
    // 'left' => 'offsetLeft'
    // 'right' => 'offsetRight'
    // 'top' => 'offsetTop'
    // 'bottom' => 'offsetBottom'

    const [pixels, setPixels] = useState('0px');

    function matchOffset() {
        const offsetToOffsetProp = (directions) => {
            return directions.map(_direction => {
                let result;
                switch (_direction) {
                    case 'left': result = 'offsetLeft'; break;
                    case 'right': result = 'offsetRight'; break;
                    case 'top': result = 'offsetTop'; break;
                    case 'bottom': result = 'offsetBottom'; break;
                    default: result = 'offsetLeft';
                }
                return result;
            });
        }

        const [startDirectionProp, endDirectionProp] = direction // defaults to using direction over startDirection, endDirection
            ? offsetToOffsetProp([direction, direction])
            : offsetToOffsetProp([startDirection, endDirection])

        const startElement = selector ? { [startDirectionProp]: 0 } : startSelector ? document.querySelector(startSelector) : { [startDirectionProp]: 0 };
        const endElement = selector ? document.querySelector(selector) : endSelector ? document.querySelector(endSelector) : { [endDirectionProp]: 0 };

        if (!startElement || !endElement) {
            setPixels('0px');
            return;
        }

        if (!customCalculation) {
            setPixels(`${endElement[endDirectionProp] - startElement[startDirectionProp]}px`);
        } else {
            const newPixels = customCalculation(endElement[endDirectionProp], startElement[startDirectionProp]);
            setPixels(newPixels);
        }
    }

    useEffect(() => matchOffset(), dependencies);
    useWindowResize(() => matchOffset());

    return pixels;
}
