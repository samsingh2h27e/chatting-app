import React from 'react'
import './styles.css'

function Register(){
    return  <div>
        <div className="main">
		<div className="card">
			<div className="sub-part register">
				<div className="sign-in">
					<h3>Register</h3>
				</div>
				<div className="card-body">
					<form className="rform sform" action="/submit" method="POST">
						<input type="text" name="fName" placeholder="First Name"/>
						<input type="text" name="LName" placeholder="Last Name"/>
						<input type="text" name="email" placeholder="Email"/>
						<input type="text" name="password" placeholder="new Password"/>
						<input type="text" name="cnPassword" placeholder="confirm Password"/>
						<div className="bt">
							<button type="submit">Register</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
    </div>
}

export default Register;