import React from 'react'
import './home.css'

function Home(){
    return <div>
        <nav>
            <input type='text' name='search' placeholder='search books' ></input>
            <div className='bt'>
                <button>login</button>
                <button>register</button>
            </div>
        </nav>
        <div className='back'>
            
        </div>
    </div>
}

export default Home;