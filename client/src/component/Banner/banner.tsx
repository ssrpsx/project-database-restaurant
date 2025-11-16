import React from 'react';

interface SingleImageProps {
    image: string;
    alt: string;
}

const SingleImage: React.FC<SingleImageProps> = ({
    image = '/Banner.png',
    alt = 'Delicious Food Banner',
}) => {
    return (
        <div className="container mx-auto mt-15 md:mt-24">
            <img
                src={image}
                alt={alt}
                className="w-full h-auto object-cover rounded-none shadow-md sm:rounded-lg"
            />
        </div>
    );
};

export default SingleImage;
