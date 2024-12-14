import React from 'react'
import './styles.css'

function Login(){
    return <div className="main">
            <div className='card'>
                <div className='sub-part'>
                    <div className ="sign-in">
					    <h3>Sign In</h3>
				    </div>
				    <div className="card-body">
					    <form className="sform" action="/submit" method="POST">
						    <div className="ip">
							    <input type="text" name="email" placeholder="Email"/>
						    </div>
						    <div class="ip">
							    <input type="text" name="pass" placeholder="Password"/>
						    </div>
						    <div className="check-box">
							    <input type="checkbox"/>
							    remember me
						    </div>
						    <div className="bt">
							    <button type="submit">login</button>
						    </div>
					</form>
				</div>
                </div>
            </div>
        </div>
}

export default Login;