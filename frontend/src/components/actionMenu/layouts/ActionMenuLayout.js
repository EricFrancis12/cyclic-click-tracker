import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ITEM_NAMES } from '../../UpperControlPanel/UpperControlPanel';
import AffiliateNetworkLayout from './AffiliateNetworkLayout';
import CampaignLayout from './CampaignLayout';
import FlowLayout from './FlowLayout';
import LandingPageLayout from './LandingPageLayout';
import OfferLayout from './OfferLayout';
import TrafficSourceLayout from './TrafficSourceLayout';

export function LoadingWrapper(props) {
    const { loading, children } = props;

    return (
        <div className={(loading ? 'relative' : '') + ' flex flex-col md:flex-row justify-start items-start overflow-y-scroll'}
            style={{ height: 'inherit' }}
        >
            {loading &&
                <div className='absolute flex justify-center items-center h-full w-full'>
                    <div>
                        {/* Replace this with a spinner animation later: */}
                        <FontAwesomeIcon icon={faSpinner} />
                    </div>
                </div>
            }
            {children}
        </div>
    )
}

export default function ActionMenuLayout(props) {
    const { actionMenu, setActionMenu, loading, handleSave, handleClose } = props;
    const type = actionMenu?.type;
    const name = actionMenu?.item?.name;

    let Layout;
    switch (name) {
        case ITEM_NAMES.AFFILIATE_NETWORKS: Layout = AffiliateNetworkLayout; break;
        case ITEM_NAMES.CAMPAIGNS: Layout = CampaignLayout; break;
        case ITEM_NAMES.FLOWS: Layout = FlowLayout; break;
        case ITEM_NAMES.LANDING_PAGES: Layout = LandingPageLayout; break;
        case ITEM_NAMES.OFFERS: Layout = OfferLayout; break;
        case ITEM_NAMES.TRAFFIC_SOURCES: Layout = TrafficSourceLayout; break;
        default: Layout = () => '';
    }

    return (
        <Layout actionMenu={actionMenu} setActionMenu={setActionMenu} loading={loading}
            handleSave={handleSave} handleClose={handleClose}
        />
    )
}
