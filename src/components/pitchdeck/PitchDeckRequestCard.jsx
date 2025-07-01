// src/components/pitchdeck/PitchDeckRequestCard.jsx

import React from 'react';
import { DocumentArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';

const statusStyles = {
    'Submitted': 'bg-blue-100 text-blue-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Feedback Sent': 'bg-green-100 text-green-800',
    'Archived': 'bg-gray-100 text-gray-800',
};

/**
 * Displays the details of a single pitch deck request.
 *
 * @param {object} request - The pitch deck request object.
 */
const PitchDeckRequestCard = ({ request }) => {
    const formattedDate = new Date(request.submitted_at).toLocaleDateString();

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{request.company_name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <ClockIcon className="h-4 w-4 mr-1.5" />
                        Submitted on {formattedDate}
                    </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${statusStyles[request.status] || statusStyles['Archived']}`}>
                    {request.status}
                </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <a
                    href={request.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Download Submission
                </a>
            </div>
        </div>
    );
};

export default PitchDeckRequestCard;