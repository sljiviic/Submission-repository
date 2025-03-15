const LoginForm = ({ username, password, handleLogin, handleUsername, handlePassword }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username </label>
        <input type="text" id="username" name="username" value={username} onChange={handleUsername} />
      </div>
      <div>
        <label htmlFor="password">Password </label>
        <input type="password" id="password" name="password" value={password} onChange={handlePassword} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm