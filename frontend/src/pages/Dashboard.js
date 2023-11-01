import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardView from '../components/views/DashboardView';
import HomeView from '../components/views/HomeView';
import ReportView from '../components/views/ReportView';

export default function Dashboard() {
    const { data } = useAuth();

    const [activeView_id, setActiveView_id] = useState(1);

    const defaultViews = [
        { type: DashboardView, _id: 0 },
        { type: HomeView, _id: 1, props: { newReport, newItem, editItem, duplicateItem, archiveItem } }
    ];

    const [spawnedViews, setSpawnedViews] = useState([]);

    function handleTabClick(view_id) {
        setActiveView_id(view_id);
    }

    function closeView(view_id) {
        const newSpawnedViews = spawnedViews.filter(view => view._id !== view_id);
        setActiveView_id(0);
        setSpawnedViews(newSpawnedViews);
    }

    function newReport(props) {
        const _props = { ...props, newItem };
        const reportView = {
            props: _props,
            type: ReportView,
            _id: crypto.randomUUID()
        };

        setSpawnedViews(currentSpawnedViews => [...currentSpawnedViews, reportView]);
        setActiveView_id(reportView._id);
    }

    function newItem(props) {
        console.log('newItem() not yet implimented');
    }

    function editItem(props) {
        console.log('editItem() not yet implimented');
    }

    function duplicateItem(props) {
        console.log('duplicateItem() not yet implimented');
    }

    function archiveItem(props) {
        console.log('archiveItem() not yet implimented');
    }

    return (
        <div className='relative' style={{ fontFamily: 'Lato,Helvetica,sans-serif,-apple-system' }}>
            <div className='flex bg-NavBar_backgroundColor' style={{ height: '40px', width: '100vw' }}>
                <div className='flex justify-center items-center h-full'>
                    <img src='/assets/images/logo.png' className='mx-6' style={{ maxWidth: '40px' }} alt='logo'></img>
                </div>
                {[...defaultViews, ...spawnedViews].map(view => (
                    <view.type
                        {...view.props}
                        key={view._id}
                        view_id={view._id}
                        active={view._id === activeView_id}
                        handleTabClick={handleTabClick}
                        closeView={closeView}
                    />
                ))}
            </div>
        </div>
    )
}
