import React from 'react';
import { StarIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx';

const Testimonial = () => (
    <div className="hidden lg:flex flex-col justify-center items-center w-full bg-gray-50 text-center">
      <div className="max-w-2xl px-6">
        <div className="flex justify-center text-yellow-500 mb-6 space-x-1"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
        <p className="font-serif text-2xl leading-relaxed text-gray-900">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla."
        </p>
        <div className="mt-10 flex items-center justify-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
          <div className="ml-4 text-left"><div className="text-base font-medium text-gray-900">Name Surname</div><div className="text-sm text-gray-500">Position, Company name</div></div>
          <div className="mx-6 h-6 w-px bg-gray-300" />
          <img src="https://assets-global.website-files.com/5e38a4392a1599540b37807c/5e38a4392a15990c743780b6_webflow.svg" alt="Webflow" className="h-6" />
        </div>
        <div className="mt-12 flex items-center justify-center space-x-6">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ArrowLeftIcon /></button>
          <div className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ArrowRightIcon /></button>
        </div>
      </div>
    </div>
);

export default Testimonial;

