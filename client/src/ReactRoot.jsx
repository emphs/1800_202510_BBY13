
import React from 'react'
import { useState } from 'react'

export default function ReactRoot({ children }) {
    const [count, setCount] = useState(0)

    return (
        <>
            <div style={{ position: 'fixed', top: "10%", left: "3%" }}>
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
        </>
    )
}
