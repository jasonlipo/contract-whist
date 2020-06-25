import React, { useState, useEffect, FC } from "react";

let URL
if (process.env.NODE_ENV == "development") {
  URL = 'http://localhost:3000'
}
else {
  URL = ""
}

const s = {
  listStyle: "none",
  padding: 20,
  borderBottom: "1px solid grey",
  width: "100%",
  "box-sizing": "border-box"
}

export const AdminList: FC = () => {
  const [files, setFiles] = useState<string[]>(null)

  useEffect(() => {
    if (files == null) {
      fetch(`${URL}/files`).then(r => r.json()).then(response => {
        setFiles(response.files)
      })
    }
  })

  return (
    <div className="admin-container" style={{ width: "100%", overflowY: "scroll" }}>
      {
        files && files.map(f =>
          <li style={s}><a href={`/admin/${f}`}>{f}</a></li>
        )
      }
    </div>
  )
}