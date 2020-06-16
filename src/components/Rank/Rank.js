import React from 'react';


const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className='f3 black pa3'>
                {`${name} , your current rank is...`}
            </div>
            <div className='f1 black pa3'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;