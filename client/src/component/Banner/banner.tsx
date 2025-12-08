import React from 'react';

const SingleImage: React.FC = () => {
    return (
        <div className="container mx-auto mt-15 md:mt-24">
            <img
                src="/Banner.png"
                alt="Delicious Food Banner"
                className="w-full h-auto object-cover rounded-none shadow-md sm:rounded-lg"
            />
        </div>
    );
};

export default SingleImage;
