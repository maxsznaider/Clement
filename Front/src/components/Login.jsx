import React, { useState } from "react"
import axios from "axios"
import { getCurrentUser } from "../store/currentUser"
import { useDispatch } from "react-redux"
import { useHistory, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const history = useHistory()
  const [showButtonSpinner, setShowButtonSpinner] = useState(false)

  const handleSubmit = function (event) {
    event.preventDefault()
    setShowButtonSpinner(true)
    axios
      .post("/api/users/login", {
        email,
        password,
      })
      .then((newUser) => {
        localStorage.setItem("token", newUser.data.token)
        dispatch(
          getCurrentUser({
            id: newUser.data.user.id,
            isAdmin: newUser.data.user.isAdmin,
          })
        )
        if (newUser.data.user.isAdmin) history.push("/")
        else history.goBack()
      })
      .catch((error) => {
        setShowButtonSpinner(false)
        setError(error.response.data)
      })
  }

  React.useEffect(() => {
    setError(false)
  }, [email, password])

  const Error = () => (
    <div className="sign-up-or-log-in-error">
      {error}
    </div>
  )

  return (
    <div className="sign-up-or-log-in">
      <h2>
        Welcome back
        <hr />
      </h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>
          {showButtonSpinner ? <div className="small-spinner"></div> : "Log In"}
        </button>
      </form>
      <Link to="/register">
        <div className="sign-up-or-log-in-no-account">
          Don't have an account? Sign up
        </div>
      </Link>
      {error && <Error />}
    </div>
  )
}

export default Login
