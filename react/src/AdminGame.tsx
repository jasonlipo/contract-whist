import React, { useState, useEffect, useRef, FC } from "react";
import MonacoEditor from 'react-monaco-editor';
import { useParams } from "react-router-dom";

let URL
if (process.env.NODE_ENV == "development") {
  URL = 'http://localhost:3000'
}
else {
  URL = ""
}

export const AdminGame: FC = () => {
  const { id } = useParams()
  const monaco = useRef(null)

  const [code, setCode] = useState<string>(null)
  const options = {
    selectOnLineNumbers: true
  }

  useEffect(() => {
    if (code == null) {
      reload()
    }
  })

  const reload = () => {
    fetch(`${URL}/fetch/${id}`).then(r => r.json()).then(response => {
      setCode(response.code)
    })
  }

  const save = () => {
    fetch(`${URL}/fetch/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: "code="+JSON.stringify(code) }).then(r => r.json()).then(() => {
      reload()
    })
  }

  return (
    <div className="admin-container" style={{ width: "100%", height: "100%" }}>
      <button onClick={reload}>Reload</button> <button onClick={save}>Save</button>
      <MonacoEditor
        ref={monaco}
        language="json"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={setCode}
      />
    </div>
  )
}