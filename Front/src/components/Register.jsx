import React, { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { getCurrentUser } from "../store/currentUser"
import { useHistory } from "react-router-dom"

const NewUser = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showButtonSpinner, setShowButtonSpinner] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = function (event) {
    event.preventDefault()
    setShowButtonSpinner(true)
    axios
      .post("/api/users/register", {
        email,
        name,
        lastName,
        password,
      })
      .then((newUser) => {
        console.log(newUser)
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

  const Error = () => <div className="sign-up-or-log-in-error">{error}</div>

  return (
    <div className="sign-up-or-log-in">
      <h2>
        Create a New Account
        <hr />
      </h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          onChange={(event) => setName(event.target.value)}
        />
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          onChange={(event) => setLastName(event.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>
          {showButtonSpinner ? (
            <div className="small-spinner"></div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      {error && <Error />}
    </div>
  )
}

export default NewUser
