import React, { useState, useEffect } from 'react';

interface RestaurantInfo {
    ID: number;
    NAME: string;
    DESCRIPTION: string;
    LOGO_URL: string;
    created_at: string;
    updated_at: string;
}



// useEffect(() => {
//     console.log(data)
// }, [data])

const SingleImage: React.FC = () => {
    const [data, setData] = useState<RestaurantInfo | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/settings/get");
                const json = await res.json();
                setData(json);
            }
            catch (error) {
                console.error(error);
            }
        };

        load()
    }, [])

    return (
        <div className="container mx-auto mt-15 md:mt-24">
            <img
                src={data ? data.LOGO_URL : "/banner.png"}
                alt="Delicious Food Banner"
                className="w-full h-auto object-cover rounded-none shadow-md sm:rounded-lg"
            />
        </div>
    );
};

export default SingleImage;
