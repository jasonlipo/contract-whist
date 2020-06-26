import React, { useState, useEffect, FC } from "react";

let URL
if (process.env.NODE_ENV == "development") {
  URL = 'http://localhost:3000'
}
else {
  URL = ""
}

const login = (password: string) => {
  localStorage.setItem('admin_token', password)
  location.href = '/admin'
}

export const AdminLogin: FC = () => {
  const [password, setPassword] = useState<string>(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_token')
    if (isAuthenticated) {
      location.href = '/admin'
    }
  })

  return (
    <div className="admin-container" style={{ width: "100%", overflowY: "scroll" }}>
      <form style={{ padding: 25 }} onSubmit={(e) => { e.preventDefault(); login(password); return false }}>
        Enter the password: <br />
        <input type="password" value={password || ""} onChange={e => setPassword(e.target.value)} /><br />
        <input type="submit" value="Log in" />
      </form>
    </div>
  )
}